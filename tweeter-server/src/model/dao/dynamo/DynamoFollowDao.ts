import {QueryCommand, TransactWriteCommand, GetCommand, type QueryCommandInput} from "@aws-sdk/lib-dynamodb";
import type { UserDto } from "tweeter-shared";
import type { FollowDao } from "../FollowDao";
import { documentClient, maxPageSize, tables } from "./DynamoDBClient";

interface FollowRecord { followerAlias: string; followeeAlias: string }

export class DynamoFollowDao implements FollowDao {
  public async getFollowees(alias: string, pageSize: number, lastAlias: string | null): Promise<[UserDto[], boolean]> {
    return this.loadUsers({
      TableName: tables.follows,
      KeyConditionExpression: "followerAlias = :alias",
      ExpressionAttributeValues: { ":alias": alias },
      Limit: maxPageSize(pageSize) + 1,
      ScanIndexForward: true,
      ...(lastAlias ? { ExclusiveStartKey: { followerAlias: alias, followeeAlias: lastAlias } } : {}),
    }, (record) => record.followeeAlias, pageSize);
  }

  public async getFollowers(alias: string, pageSize: number, lastAlias: string | null): Promise<[UserDto[], boolean]> {
    return this.loadUsers({
      TableName: tables.follows,
      IndexName: "followeeAlias-index",
      KeyConditionExpression: "followeeAlias = :alias",
      ExpressionAttributeValues: { ":alias": alias },
      Limit: maxPageSize(pageSize) + 1,
      ScanIndexForward: true,...(lastAlias ? { ExclusiveStartKey: { followerAlias: lastAlias, followeeAlias: alias } } : {})
    }, (record) => record.followerAlias, pageSize);
  }

  private async loadUsers(
    input: QueryCommandInput,
    getAlias: (record: FollowRecord) => string,
    pageSize: number,
  ): Promise<[UserDto[], boolean]> {
    const response = await documentClient.send(new QueryCommand(input));
    const records = (response.Items ?? []) as FollowRecord[];
    const hasMore = records.length > maxPageSize(pageSize);
    const page = records.slice(0, maxPageSize(pageSize));
    const items = await Promise.all(page.map(async (record): Promise<UserDto | null> => {
    const result = await documentClient.send(new GetCommand({
        TableName: tables.users,
        Key: { alias: getAlias(record) },
        ProjectionExpression: "alias, firstName, lastName, imageUrl",
      }));
      const user = result.Item as UserDto | undefined;
      return user ?? null;
    }));
    return [items.filter((user): user is UserDto => user !== null), hasMore];
  }

  public async isFollower(followerAlias: string, followeeAlias: string): Promise<boolean> {
    const response = await documentClient.send(new QueryCommand({
      TableName: tables.follows,
      KeyConditionExpression: "followerAlias = :follower AND followeeAlias = :followee",
      ExpressionAttributeValues: { ":follower": followerAlias, ":followee": followeeAlias },
      Limit: 1,
      Select: "COUNT",
      ConsistentRead: true,
    }));
    return (response.Count ?? 0) > 0;
  }

  public async addFollow(followerAlias: string, followeeAlias: string): Promise<void> {
    try {
      await documentClient.send(new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              TableName: tables.follows,
              Item: { followerAlias, followeeAlias },
              ConditionExpression: "attribute_not_exists(followerAlias)",
            },
          },
          {
            Update: {
              TableName: tables.users,
              Key: { alias: followerAlias },
              UpdateExpression: "SET followeeCount = if_not_exists(followeeCount, :zero) + :one",
              ExpressionAttributeValues: { ":zero": 0, ":one": 1 },
              ConditionExpression: "attribute_exists(alias)",
            },
          },
          {
            Update: {
              TableName: tables.users,
              Key: { alias: followeeAlias },
              UpdateExpression: "SET followerCount = if_not_exists(followerCount, :zero) + :one",
              ExpressionAttributeValues: { ":zero": 0, ":one": 1 },
              ConditionExpression: "attribute_exists(alias)",
            },
          },
        ],
      }));
    } catch (error) {
      if ((error as { name?: string }).name === "TransactionCanceledException" && await this.isFollower(followerAlias, followeeAlias)) return;
      throw error;
    }
  }
  public async removeFollow(followerAlias: string, followeeAlias: string): Promise<void> {
    try {
      await documentClient.send(new TransactWriteCommand({
        TransactItems: [
          {
            Delete: {
              TableName: tables.follows,
              Key: { followerAlias, followeeAlias },
              ConditionExpression: "attribute_exists(followerAlias)",
            },
          },
          {
            Update: {
              TableName: tables.users,
              Key: { alias: followerAlias },
              UpdateExpression: "SET followeeCount = followeeCount - :one",
              ExpressionAttributeValues: { ":one": 1, ":zero": 0 },
              ConditionExpression: "followeeCount > :zero",
            },
          },
          {
            Update: {
              TableName: tables.users,
              Key: { alias: followeeAlias },
              UpdateExpression: "SET followerCount = followerCount - :one",
              ExpressionAttributeValues: { ":one": 1, ":zero": 0 },
              ConditionExpression: "followerCount > :zero",
            },
          },
        ],
      }));
    } catch (error) {
      if ((error as { name?: string }).name === "TransactionCanceledException" && !(await this.isFollower(followerAlias, followeeAlias))) return;
      throw error;
    }
  }
}
