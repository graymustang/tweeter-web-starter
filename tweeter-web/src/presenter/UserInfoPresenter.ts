import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
  setUserInfo: (isFollower: boolean, followeeCount: number, followerCount: number) => void;
  setLoading: (loading: boolean) => void;
  currentUserSelected: (user: User, path: string) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private readonly service = new FollowService();
  private requestId = 0;

  public constructor(view: UserInfoView) {
    super(view);
  }

  public async loadUserInfo(
    authToken: AuthToken | null,
    currentUser: User | null,
    displayedUser: User | null,
  ): Promise<void> {
    if (!authToken || !currentUser || !displayedUser) return;
    const requestId = ++this.requestId;
    await this.doFailureReportingOperation(async () => {
      const [isFollower, followeeCount, followerCount] = await Promise.all([
        currentUser.equals(displayedUser)
          ? Promise.resolve(false)
          : this.service.getIsFollower(authToken, currentUser, displayedUser),
        this.service.getFolloweeCount(authToken, displayedUser),
        this.service.getFollowerCount(authToken, displayedUser),
      ]);
      if (requestId === this.requestId) {
        this.view.setUserInfo(isFollower, followeeCount, followerCount);
      }
    }, "load user information", (error) => {
      if (requestId === this.requestId) {
        this.view.displayErrorMessage(`Failed to load user information because of exception: ${error}`);
      }
    });
  }

  public showCurrentUser(currentUser: User | null, currentPath: string): void {
    if (!currentUser) return;
    const basePath = currentPath.split("/@")[0] || "/";
    this.view.currentUserSelected(currentUser, `${basePath}/${currentUser.alias}`);
  }

  public async follow(authToken: AuthToken | null, user: User | null): Promise<void> {
    await this.updateFollowStatus(true, authToken, user);
  }

  public async unfollow(authToken: AuthToken | null, user: User | null): Promise<void> {
    await this.updateFollowStatus(false, authToken, user);
  }

  private async updateFollowStatus(
    following: boolean,
    authToken: AuthToken | null,
    user: User | null,
  ): Promise<void> {
    if (!authToken || !user) return;
    await this.doFailureReportingOperation(async () => {
      this.view.setLoading(true);
      let messageId = "";
      try {
        messageId = this.view.displayInfoMessage(`${following ? "Following" : "Unfollowing"} ${user.name}...`);
        const [followerCount, followeeCount] = following
          ? await this.service.follow(authToken, user)
          : await this.service.unfollow(authToken, user);
        this.view.setUserInfo(following, followeeCount, followerCount);
      } finally {
        if (messageId) this.view.deleteMessage(messageId);
        this.view.setLoading(false);
      }
    }, `${following ? "follow" : "unfollow"} user`);
  }
}
