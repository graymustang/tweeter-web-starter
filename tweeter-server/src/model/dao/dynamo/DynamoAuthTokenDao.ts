import { DeleteCommand, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { AuthToken } from "tweeter-shared";
import type { AuthTokenDao } from "../AuthTokenDao";
import { documentClient, tables } from "./DynamoDBClient";

const tokenLifetimeSeconds = Number(process.env.AUTH_TOKEN_TTL_SECONDS ?? 1800);
interface TokenRecord {
  token: string;
  timestamp: number;
  expiresAt: number;
  userAlias: string;
}

export class DynamoAuthTokenDao implements AuthTokenDao {
  public async createToken(authToken: AuthToken, userAlias: string): Promise<void> {
    await documentClient.send(new PutCommand({
      TableName: tables.authTokens,
      Item: {
        token: authToken.token,
        timestamp: authToken.timestamp,
        expiresAt: Math.floor(authToken.timestamp / 1000) + tokenLifetimeSeconds,
        userAlias,
      } satisfies TokenRecord,
    }));
  }

  public async getToken(token: string): Promise<{ authToken: AuthToken; userAlias: string } | null> {
    const response = await documentClient.send(new GetCommand({
      TableName: tables.authTokens,
      Key: { token },
      ConsistentRead: true,
    }));
    const record = response.Item as TokenRecord | undefined;
    return record ? { authToken: new AuthToken(record.token, record.timestamp), userAlias: record.userAlias } : null;
  }

  public async touchToken(token: string, timestamp: number): Promise<void> {
    try {
      await documentClient.send(new UpdateCommand({
        TableName: tables.authTokens,
        Key: { token },
        UpdateExpression: "SET #timestamp = :timestamp, expiresAt = :expiresAt",
        ExpressionAttributeNames: { "#timestamp": "timestamp" },
        ExpressionAttributeValues: {
          ":timestamp": timestamp,
          ":expiresAt": Math.floor(timestamp / 1000) + tokenLifetimeSeconds,
        },
        ConditionExpression: "attribute_exists(token)",
      }));
    } catch (error) {
      if ((error as { name?: string }).name === "ConditionalCheckFailedException") {
        throw new Error("unauthorized: The authentication token is no longer active");
      }
      throw error;
    }
  }

  public async deleteToken(token: string): Promise<void> {
    await documentClient.send(new DeleteCommand({ TableName: tables.authTokens, Key: { token } }));
  }
}
