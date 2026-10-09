import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../components/model.service/FollowService";

export interface UserInfoView {
  setUserInfo: (isFollower: boolean, followeeCount: number, followerCount: number) => void;
  setLoading: (loading: boolean) => void;
  displayInfoMessage: (message: string) => string;
  deleteMessage: (id: string) => void;
  displayErrorMessage: (message: string) => void;
  currentUserSelected: (user: User, path: string) => void;
}

export class UserInfoPresenter {
  private readonly service = new FollowService();
  private requestId = 0;

  public constructor(private readonly view: UserInfoView) {}

  public async loadUserInfo(
    authToken: AuthToken | null,
    currentUser: User | null,
    displayedUser: User | null,
  ): Promise<void> {
    if (!authToken || !currentUser || !displayedUser) return;
    const requestId = ++this.requestId;
    try {
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
    } catch (error) {
      if (requestId === this.requestId) {
        this.view.displayErrorMessage(`Failed to load user information because of exception: ${error}`);
      }
    }
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
    let messageId = "";
    try {
      this.view.setLoading(true);
      messageId = this.view.displayInfoMessage(`${following ? "Following" : "Unfollowing"} ${user.name}...`);
      const [followerCount, followeeCount] = following
        ? await this.service.follow(authToken, user)
        : await this.service.unfollow(authToken, user);
      this.view.setUserInfo(following, followeeCount, followerCount);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to ${following ? "follow" : "unfollow"} user because of exception: ${error}`);
    } finally {
      if (messageId) this.view.deleteMessage(messageId);
      this.view.setLoading(false);
    }
  }
}
