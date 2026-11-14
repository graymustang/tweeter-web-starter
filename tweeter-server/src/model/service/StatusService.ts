import { FakeData, Status } from "tweeter-shared";

export class StatusService {
  public async loadMoreFeedItems( _token: string, _userAlias: string, pageSize: number, lastItem: Status | null ): Promise<[Status[], boolean]> {
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }

  public async loadMoreStoryItems( _token: string, userAlias: string, pageSize: number, lastItem: Status | null): Promise<[Status[], boolean]> {
    if (!FakeData.instance.findUserByAlias(userAlias)) return [[], false];
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }

  public async postStatus(_token: string, _status: Status): Promise<void> {}
}
