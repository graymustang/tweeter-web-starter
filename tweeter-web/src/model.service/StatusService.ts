import { AuthToken, FakeData, Status } from "tweeter-shared";

export class StatusService {
  public async loadMoreFeedItems(
    _authToken: AuthToken,
    _userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }

  public async loadMoreStoryItems(
    _authToken: AuthToken,
    _userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }

  public async postStatus(_authToken: AuthToken, _status: Status): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}
