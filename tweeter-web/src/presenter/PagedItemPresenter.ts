import { AuthToken } from "tweeter-shared";
import { Service } from "../model.service/Service";
import { Presenter, View } from "./Presenter";

export const PAGE_SIZE = 10;

export interface PagedItemView<T> extends View {
  addItems: (newItems: T[]) => void;
}

export interface PagedItemLoader<T> {
  readonly hasMoreItems: boolean;
  reset: () => void;
  loadMoreItems: (authToken: AuthToken, userAlias: string) => Promise<void>;
}

export abstract class PagedItemPresenter<T, U extends Service>
  extends Presenter<PagedItemView<T>> implements PagedItemLoader<T> {
  protected lastItem: T | null = null;
  private _hasMoreItems = true;
  private readonly _service: U;

  public constructor(view: PagedItemView<T>) {
    super(view);
    this._service = this.serviceFactory();
  }

  protected abstract serviceFactory(): U;

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  protected get service(): U {
    return this._service;
  }

  public reset(): void {
    this.lastItem = null;
    this.hasMoreItems = true;
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const [newItems, hasMore] = await this.getMoreItems(authToken, userAlias);
      this.hasMoreItems = hasMore;
      if (newItems.length > 0) this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    }, this.itemDescription());
  }

  protected abstract itemDescription(): string;

  protected abstract getMoreItems(
    authToken: AuthToken,
    userAlias: string,
  ): Promise<[T[], boolean]>;
}
