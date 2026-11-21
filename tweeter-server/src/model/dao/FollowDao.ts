import type { UserDto } from "tweeter-shared";

export interface FollowDao {
  getFollowees(alias: string, pageSize: number, lastAlias: string | null): Promise<[UserDto[], boolean]>;
  getFollowers(alias: string, pageSize: number, lastAlias: string | null): Promise<[UserDto[], boolean]>;
  isFollower(followerAlias: string, followeeAlias: string): Promise<boolean>;
  addFollow(followerAlias: string, followeeAlias: string): Promise<void>;
  removeFollow(followerAlias: string, followeeAlias: string): Promise<void>;
}
