import type { DaoFactory } from "../DaoFactory";
import { DynamoAuthTokenDao } from "./DynamoAuthTokenDao";
import { DynamoFeedDao } from "./DynamoFeedDao";
import { DynamoFollowDao } from "./DynamoFollowDao";
import { S3ImageDao } from "./S3ImageDao";
import { DynamoStatusDao } from "./DynamoStatusDao";
import { DynamoUserDao } from "./DynamoUserDao";
export class DynamoDBDaoFactory implements DaoFactory {
  private readonly userDao = new DynamoUserDao();
  private readonly authTokenDao = new DynamoAuthTokenDao();
  private readonly followDao = new DynamoFollowDao();
  private readonly statusDao = new DynamoStatusDao();
  private readonly feedDao = new DynamoFeedDao();
  private readonly imageDao = new S3ImageDao();

  public getUserDao() { return this.userDao; }
  public getAuthTokenDao() { return this.authTokenDao; }
  public getFollowDao() { return this.followDao; }
  public getStatusDao() { return this.statusDao; }
  public getFeedDao() { return this.feedDao; }
  public getImageDao() { return this.imageDao; }
}
