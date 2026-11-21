import type { Status } from "tweeter-shared";

export interface StatusDao {
  postStatus(status: Status): Promise<void>;
  getStoryItems(alias: string, pageSize: number, lastTimestamp: number | null): Promise<[Status[], boolean]>;
}
