import type { Status } from "tweeter-shared";

export interface FeedDao {
  addToFeeds(followerAliases: string[], status: Status): Promise<void>;
  getFeedItems(alias: string, pageSize: number, lastTimestamp: number | null): Promise<[Status[], boolean]>;
}
