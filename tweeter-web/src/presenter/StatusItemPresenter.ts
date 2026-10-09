import { AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../components/model.service/StatusService";

export interface StatusItemView {
  addItems: (items: Status[]) => void;
  displayErrorMessage: (message: string) => void;
}

export type StatusListType = "feed" | "story";

export class StatusItemPresenter {
  private readonly service = new StatusService();
  private lastItem: Status | null = null;
  private _hasMoreItems = true;

  public constructor(
    private readonly view: StatusItemView,
    private readonly listType: StatusListType,
  ) {}

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  public reset(): void {
    this.lastItem = null;
    this._hasMoreItems = true;
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string): Promise<void> {
    try {
      const load = this.listType === "feed"
        ? this.service.loadMoreFeedItems.bind(this.service)
        : this.service.loadMoreStoryItems.bind(this.service);
      const [items, hasMore] = await load(authToken, userAlias, 10, this.lastItem);
      this._hasMoreItems = hasMore;
      if (items.length > 0) this.lastItem = items[items.length - 1];
      this.view.addItems(items);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to load ${this.listType} items because of exception: ${error}`);
    }
  }
}
