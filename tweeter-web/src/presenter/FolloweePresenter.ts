import { AuthToken } from "tweeter-shared";
import { FollowService } from "../components/model.service/FollowService";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";

export const PAGE_SIZE = 10;

export class FolloweePresenter extends UserItemPresenter {
  private readonly service = new FollowService();

  public constructor(view: UserItemView) {
    super(view);
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string): Promise<void> {
    try {
      const [newItems, hasMore] = await this.service.loadMoreFollowees(
        authToken,
        userAlias,
        PAGE_SIZE,
        this.lastItem,
      );
      this.hasMoreItems = hasMore;
      if (newItems.length > 0) this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to load followees because of exception: ${error}`);
    }
  }
}
