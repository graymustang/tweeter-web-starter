import { AuthToken, FakeData, User } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";
const serverFacade = new ServerFacade();

export class FollowService implements Service {
  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastFollowee: User | null,
  ): Promise<[User[], boolean]> {
    return serverFacade.getMoreFollowees({
      token: authToken.token,
      userAlias,
      pageSize,
      lastItem: lastFollowee?.dto ?? null,
    });
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastFollower: User | null,
  ): Promise<[User[], boolean]> {
    return serverFacade.getMoreFollowers({
      token: authToken.token,
      userAlias,
      pageSize,
      lastItem: lastFollower?.dto ?? null,
    });
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
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    return serverFacade.getFollowerCount({
      token: authToken.token,
      user: user.dto,
    });
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
