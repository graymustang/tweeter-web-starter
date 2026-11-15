import { AuthToken, Status } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";
const serverFacade = new ServerFacade();

export class StatusService implements Service{
  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    return serverFacade.getMoreFeedItems({
      token: authToken.token,
      userAlias,
      pageSize,
      lastItem: lastItem ? { post: lastItem.post, user: lastItem.user.dto, timestamp: lastItem.timestamp }: null,
    });
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    return serverFacade.getMoreStoryItems({
      token: authToken.token,
      userAlias,
      pageSize,
      lastItem: lastItem ? { post: lastItem.post, user: lastItem.user.dto, timestamp: lastItem.timestamp } : null,
    });
  }

  public async postStatus(authToken: AuthToken, status: Status): Promise<void> {
    return serverFacade.postStatus({
      token: authToken.token,
      post: status.post,
      userAlias: status.user.alias,
      timestamp: status.timestamp,
    });
  }
}
