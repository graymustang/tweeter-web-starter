import type { User } from "tweeter-shared";

export interface UserDao {
  getUser(alias: string): Promise<User | null>;
  getPasswordHash(alias: string): Promise<string | null>;
  createUser(user: User, passwordHash: string): Promise<void>;
  getFollowCounts(alias: string): Promise<{ followerCount: number; followeeCount: number } | null>;
}
