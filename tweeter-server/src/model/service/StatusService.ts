import { Status } from "tweeter-shared";
import type { DaoFactory } from "../dao/DaoFactory";
import { AuthorizationService } from "./AuthorizationService";

export class StatusService {
  private readonly authorizationService: AuthorizationService;

  public constructor(private readonly daoFactory: DaoFactory) {
    this.authorizationService = new AuthorizationService(daoFactory);
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    const authenticatedAlias = await this.authorizationService.authorize(token);
    if (authenticatedAlias !== userAlias) throw new Error("unauthorized: You can only load your own feed");
    return this.daoFactory.getFeedDao().getFeedItems(userAlias, pageSize, lastItem?.timestamp ?? null);
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    await this.authorizationService.authorize(token);
    return this.daoFactory.getStatusDao().getStoryItems(userAlias, pageSize, lastItem?.timestamp ?? null);
  }

  public async postStatus(token: string, userAlias: string, post: string, timestamp: number): Promise<void> {
    const authenticatedAlias = await this.authorizationService.authorize(token);
    if (authenticatedAlias !== userAlias) throw new Error("unauthorized: You can only post as your own account");

    const user = await this.daoFactory.getUserDao().getUser(authenticatedAlias);
    if (!user) throw new Error("unauthorized: The authenticated account no longer exists");
    if (!post.trim()) throw new Error("bad-request: A status cannot be empty");

    const status = new Status(post, user, Number.isFinite(timestamp) ? timestamp : Date.now());
    await this.daoFactory.getStatusDao().postStatus(status);

    const followDao = this.daoFactory.getFollowDao();
    let lastFollowerAlias: string | null = null;
    let hasMore = true;
    while (hasMore) {
      const [followers, more] = await followDao.getFollowers(authenticatedAlias, 100, lastFollowerAlias);
      if (followers.length === 0) {
        if (more) throw new Error("internal-server-error: Follower pagination did not advance");
        break;
      }
      await this.daoFactory.getFeedDao().addToFeeds(followers.map((follower) => follower.alias), status);
      const nextAlias = followers[followers.length - 1].alias;
      if (nextAlias === lastFollowerAlias && more) throw new Error("internal-server-error: Follower pagination did not advance");
      lastFollowerAlias = nextAlias;
      hasMore = more;
    }
  }
}
