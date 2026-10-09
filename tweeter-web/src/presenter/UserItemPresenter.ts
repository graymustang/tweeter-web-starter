import { AuthToken, User } from "tweeter-shared";

export interface UserItemView {
  addItems: (newItems: User[]) => void;
  displayErrorMessage: (message: string) => void;
}

export abstract class UserItemPresenter {
  protected lastItem: User | null = null;
  private _hasMoreItems = true;

  protected constructor(protected readonly view: UserItemView) {}

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  public reset(): void {
    this.lastItem = null;
    this.hasMoreItems = true;
  }

  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): Promise<void>;
}
