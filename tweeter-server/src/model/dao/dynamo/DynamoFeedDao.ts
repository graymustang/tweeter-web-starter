import { BatchWriteCommand, QueryCommand, type BatchWriteCommandInput } from "@aws-sdk/lib-dynamodb";
import { Status, User } from "tweeter-shared";
import type { FeedDao } from "../FeedDao";
import { documentClient, maxPageSize, tables } from "./DynamoDBClient";

interface FeedRecord {
  userAlias: string;
  timestamp: number;
  post: string;
  author: { alias: string; firstName: string; lastName: string; imageUrl: string };
}

const toStatus = (record: FeedRecord): Status => new Status(
  record.post,
  new User(record.author.firstName, record.author.lastName, record.author.alias, record.author.imageUrl),
  record.timestamp,
);

export class DynamoFeedDao implements FeedDao {
  public async addToFeeds(followerAliases: string[], status: Status): Promise<void> {
    const requests = followerAliases.map((userAlias) => ({
      PutRequest: {
        Item: {
          userAlias,
          timestamp: status.timestamp,
          post: status.post,
          author: status.user.dto,
        },
      },
    }));

    for (let index = 0; index < requests.length; index += 25) {
      let pending = requests.slice(index, index + 25);
      let attempt = 0;
      while (pending.length > 0) {
        const response = await documentClient.send(new BatchWriteCommand({
          RequestItems: { [tables.feeds]: pending },
        } satisfies BatchWriteCommandInput));
        pending = (response.UnprocessedItems?.[tables.feeds] ?? []) as typeof pending;
        if (pending.length > 0) {
          attempt += 1;
          const backoffMs = Math.min(1000, 50 * 2 ** Math.min(attempt, 5));
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
        }
      }
    }
  }

  public async getFeedItems(alias: string, pageSize: number, lastTimestamp: number | null): Promise<[Status[], boolean]> {
    const response = await documentClient.send(new QueryCommand({
      TableName: tables.feeds,
      KeyConditionExpression: "userAlias = :alias" + (lastTimestamp === null ? "" : " AND #timestamp < :lastTimestamp"),...(lastTimestamp === null ? {} : { ExpressionAttributeNames: { "#timestamp": "timestamp" } }),
      ExpressionAttributeValues: {":alias": alias,...(lastTimestamp === null ? {} : { ":lastTimestamp": lastTimestamp }),
      },
      Limit: maxPageSize(pageSize) + 1,
      ScanIndexForward: false,
    }));
    const records = (response.Items ?? []) as FeedRecord[];
    const hasMore = records.length > maxPageSize(pageSize);
    return [records.slice(0, maxPageSize(pageSize)).map(toStatus), hasMore];
  }
}
