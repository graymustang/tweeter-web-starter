import { AuthToken, FakeData, User } from "tweeter-shared";

export class FollowService {
  public async loadMoreFollowees(
    _authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastFollowee: User | null,
  ): Promise<[User[], boolean]> {
    return FakeData.instance.getPageOfUsers(lastFollowee, pageSize, userAlias);
  }

  public async loadMoreFollowers(
    _authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastFollower: User | null,
  ): Promise<[User[], boolean]> {
    return FakeData.instance.getPageOfUsers(lastFollower, pageSize, userAlias);
  }

  public async getIsFollower(
    _authToken: AuthToken,
    _user: User,
    _selectedUser: User,
  ): Promise<boolean> {
    return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(
    _authToken: AuthToken,
    user: User,
  ): Promise<number> {
    return FakeData.instance.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(
    _authToken: AuthToken,
    user: User,
  ): Promise<number> {
    return FakeData.instance.getFollowerCount(user.alias);
  }

  public async follow(
    authToken: AuthToken,
    user: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return [
      await this.getFollowerCount(authToken, user),
      await this.getFolloweeCount(authToken, user),
    ];
  }

  public async unfollow(
    authToken: AuthToken,
    user: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return [
      await this.getFollowerCount(authToken, user),
      await this.getFolloweeCount(authToken, user),
    ];
  }
}
