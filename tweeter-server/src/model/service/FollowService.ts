import { AuthToken, User, type UserDto } from "tweeter-shared";
import type { DaoFactory } from "../dao/DaoFactory";
import { AuthorizationService } from "./AuthorizationService";

export class FollowService {
  private readonly authorizationService: AuthorizationService;

  public constructor(private readonly daoFactory: DaoFactory) {
    this.authorizationService = new AuthorizationService(daoFactory);
  }

  public async loadMoreFollowees(token: string, userAlias: string, pageSize: number, lastFollowee: UserDto | null): Promise<[UserDto[], boolean]> {
    await this.authorizationService.authorize(token);
    return this.daoFactory.getFollowDao().getFollowees(userAlias, pageSize, lastFollowee?.alias ?? null);
  }

  public async loadMoreFollowers(token: string, userAlias: string, pageSize: number, lastFollower: UserDto | null): Promise<[UserDto[], boolean]> {
    await this.authorizationService.authorize(token);
    return this.daoFactory.getFollowDao().getFollowers(userAlias, pageSize, lastFollower?.alias ?? null);
  }

  public async getIsFollower(authToken: AuthToken, user: User, selectedUser: User): Promise<boolean> {
    const authenticatedAlias = await this.authorizationService.authorize(authToken.token);
    if (authenticatedAlias !== user.alias) throw new Error("unauthorized: The requested follower does not match the session");
    return this.daoFactory.getFollowDao().isFollower(authenticatedAlias, selectedUser.alias);
  }

  public async getFolloweeCount(authToken: AuthToken, user: User): Promise<number> {
    await this.authorizationService.authorize(authToken.token);
    const counts = await this.daoFactory.getUserDao().getFollowCounts(user.alias);
    if (!counts) throw new Error("bad-request: User not found");
    return counts.followeeCount;
  }

  public async getFollowerCount(authToken: AuthToken, user: User): Promise<number> {
    await this.authorizationService.authorize(authToken.token);
    const counts = await this.daoFactory.getUserDao().getFollowCounts(user.alias);
    if (!counts) throw new Error("bad-request: User not found");
    return counts.followerCount;
  }

  public async follow(authToken: AuthToken, user: User): Promise<[followerCount: number, followeeCount: number]> {
    const followerAlias = await this.authorizationService.authorize(authToken.token);
    if (followerAlias === user.alias) throw new Error("bad-request: A user cannot follow themselves");
    if (!(await this.daoFactory.getUserDao().getUser(user.alias))) throw new Error("bad-request: User not found");

    await this.daoFactory.getFollowDao().addFollow(followerAlias, user.alias);
    const counts = await this.daoFactory.getUserDao().getFollowCounts(user.alias);
    if (!counts) throw new Error("bad-request: User not found");
    return [counts.followerCount, counts.followeeCount];
  }

  public async unfollow(authToken: AuthToken, user: User): Promise<[followerCount: number, followeeCount: number]> {
    const followerAlias = await this.authorizationService.authorize(authToken.token);
    if (!(await this.daoFactory.getUserDao().getUser(user.alias))) throw new Error("bad-request: User not found");

    await this.daoFactory.getFollowDao().removeFollow(followerAlias, user.alias);
    const counts = await this.daoFactory.getUserDao().getFollowCounts(user.alias);
    if (!counts) throw new Error("bad-request: User not found");
    return [counts.followerCount, counts.followeeCount];
  }
}
