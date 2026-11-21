import type { AuthTokenDao } from "./AuthTokenDao";
import type { FeedDao } from "./FeedDao";
import type { FollowDao } from "./FollowDao";
import type { ImageDao } from "./ImageDao";
import type { StatusDao } from "./StatusDao";
import type { UserDao } from "./UserDao";
export interface DaoFactory {
  getUserDao(): UserDao;
  getAuthTokenDao(): AuthTokenDao;
  getFollowDao(): FollowDao;
  getStatusDao(): StatusDao;
  getFeedDao(): FeedDao;
  getImageDao(): ImageDao;
}
