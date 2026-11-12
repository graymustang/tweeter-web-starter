import { AuthToken, FakeData, User, UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class FollowService implements Service {
  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastFollowee: UserDto | null,
  ): Promise<[UserDto[], boolean]> {
    return this.getFakeData(pageSize, userAlias, lastFollowee);
  }

  private async getFakeData(
    pageSize: number,
    userAlias: string,
    lastItem: UserDto | null,
  ): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(
      User.fromDto(lastItem),
      pageSize,
      userAlias,
    );
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMore];
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastFollower: UserDto | null,
  ): Promise<[UserDto[], boolean]> {
    return this.getFakeData(pageSize, userAlias, lastFollower);
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
