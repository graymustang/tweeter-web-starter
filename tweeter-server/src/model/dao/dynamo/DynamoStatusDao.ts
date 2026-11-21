import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { Status, User } from "tweeter-shared";
import type { StatusDao } from "../StatusDao";
import { documentClient, maxPageSize, tables } from "./DynamoDBClient";

interface StatusRecord {
  userAlias: string;
  timestamp: number;
  post: string;
  author: { alias: string; firstName: string; lastName: string; imageUrl:string};
}
const toStatus = (record: StatusRecord): Status => new Status(
  record.post,
  new User(record.author.firstName, record.author.lastName, record.author.alias, record.author.imageUrl),
  record.timestamp,
);

export class DynamoStatusDao implements StatusDao {
  public async postStatus(status: Status): Promise<void> {
    await documentClient.send(new PutCommand({
      TableName: tables.stories,
      Item: {  userAlias: status.user.alias,  timestamp: status.timestamp,  post: status.post,  author: status.user.dto,} satisfies StatusRecord
    }));
  }

  public async getStoryItems(alias: string, pageSize: number, lastTimestamp: number | null): Promise<[Status[], boolean]> {
    const response = await documentClient.send(new QueryCommand({
      TableName: tables.stories,
      KeyConditionExpression: "userAlias = :alias" + (lastTimestamp === null ? "" : " AND #timestamp < :lastTimestamp"),...(lastTimestamp === null ? {} : { ExpressionAttributeNames: { "#timestamp": "timestamp" } }),
      ExpressionAttributeValues: { ":alias": alias, ...(lastTimestamp === null ? {} : { ":lastTimestamp": lastTimestamp }),
      },
      Limit: maxPageSize(pageSize) + 1,
      ScanIndexForward: false,
    }));
    const records = (response.Items ?? []) as StatusRecord[];
    const hasMore = records.length > maxPageSize(pageSize);
    return [records.slice(0, maxPageSize(pageSize)).map(toStatus), hasMore];
  }
}
