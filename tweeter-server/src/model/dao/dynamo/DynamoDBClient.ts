import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
const baseClient = new DynamoDBClient({region: process.env.AWS_REGION });
export const documentClient = DynamoDBDocumentClient.from(baseClient, {
  marshallOptions: { removeUndefinedValues: true },
});

export const tables = {
  users: process.env.USERS_TABLE ?? "TweeterUsers",
  authTokens: process.env.AUTH_TOKENS_TABLE ?? "TweeterAuthTokens",
  follows: process.env.FOLLOWS_TABLE ?? "TweeterFollows",
  stories: process.env.STORIES_TABLE ?? "TweeterStories",
  feeds: process.env.FEEDS_TABLE ?? "TweeterFeeds",
};

export const maxPageSize = (pageSize: number): number =>Number.isFinite(pageSize) ? Math.max(1, Math.min(100, Math.floor(pageSize))) : 10;
