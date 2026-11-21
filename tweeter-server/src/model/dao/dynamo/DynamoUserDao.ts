import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { User } from "tweeter-shared";
import type { UserDao } from "../UserDao";
import { documentClient, tables } from "./DynamoDBClient";

interface UserRecord {
  alias: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  passwordHash?: string;
  followerCount?: number;
  followeeCount?: number;
}

export class DynamoUserDao implements UserDao {
  public async getUser(alias: string): Promise<User | null> {
    const response = await documentClient.send(new GetCommand({
      TableName: tables.users,
      Key: { alias },
      ProjectionExpression: "alias, firstName, lastName, imageUrl",
      ConsistentRead: true,
    }));
    const record = response.Item as UserRecord | undefined;
    return record ? new User(record.firstName, record.lastName, record.alias, record.imageUrl) : null;
  }

  public async getPasswordHash(alias: string): Promise<string | null> {
    const response = await documentClient.send(new GetCommand({
      TableName: tables.users,
      Key: { alias },
      ProjectionExpression: "passwordHash",
      ConsistentRead: true,
    }));
    return (response.Item as Pick<UserRecord, "passwordHash"> | undefined)?.passwordHash ?? null;
  }

  public async createUser(user: User, passwordHash: string): Promise<void> {
    try {
      await documentClient.send(new PutCommand({
        TableName: tables.users,
        Item: {alias: user.alias,  firstName: user.firstName,  lastName: user.lastName,  imageUrl: user.imageUrl,  passwordHash,  followerCount: 0,  followeeCount: 0},
        ConditionExpression: "attribute_not_exists(alias)",
      }));
    } catch (error) {
      if ((error as { name?: string }).name === "ConditionalCheckFailedException") {
        throw new Error("bad-request: That alias is already registered");
      }
      throw error;
    }
  }

  public async getFollowCounts(alias: string): Promise<{ followerCount: number; followeeCount: number } | null> {
    const response = await documentClient.send(new GetCommand({
      TableName: tables.users,
      Key: { alias },
      ProjectionExpression: "followerCount, followeeCount",
      ConsistentRead: true,
    }));
    const record = response.Item as Pick<UserRecord, "followerCount" | "followeeCount"> | undefined;
    return record ?{  followerCount: record.followerCount ?? 0,  followeeCount: record.followeeCount ?? 0} : null;
  }
}
