import { AuthToken } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";
import { PAGE_SIZE } from "./FolloweePresenter";

export class FollowerPresenter extends UserItemPresenter {
  private readonly service = new FollowService();

  public constructor(view: UserItemView) {
    super(view);
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string): Promise<void> {
    try {
      const [newItems, hasMore] = await this.service.loadMoreFollowers(
        authToken,
        userAlias,
        PAGE_SIZE,
        this.lastItem,
      );
      this.hasMoreItems = hasMore;
      if (newItems.length > 0) this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to load followers because of exception: ${error}`);
    }
  }
}
