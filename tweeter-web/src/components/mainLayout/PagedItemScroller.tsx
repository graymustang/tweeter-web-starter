import { ReactElement, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { AuthToken, User } from "tweeter-shared";
import useUserInfo from "../hooks/useUserInfo";
import useUserNavigation from "../hooks/useUserNavigation";
import useMessageActions from "../hooks/useMessageActions";
import { ToastType } from "../toaster/Toast";
import { PagedItemLoader, PagedItemView } from "../../presenter/PagedItemPresenter";

interface Props<T> {
  featurePath: string;
  presenterFactory: (view: PagedItemView<T>) => PagedItemLoader<T>;
  itemComponentGenerator: (
    item: T,
    navigateToUser: (event: React.MouseEvent) => Promise<void>,
  ) => ReactElement;
  itemKeyGenerator: (item: T, index: number) => React.Key;
}

const PagedItemScroller = <T,>({
  featurePath,
  presenterFactory,
  itemComponentGenerator,
  itemKeyGenerator,
}: Props<T>) => {
  const { displayedUser, authToken } = useUserInfo();
  const { navigateToUser } = useUserNavigation(featurePath);
  const { displayToast } = useMessageActions();
  const [items, setItems] = useState<T[]>([]);
  const presenterRef = useRef<PagedItemLoader<T> | null>(null);

  if (!presenterRef.current) {
    const view: PagedItemView<T> = {
      addItems: (newItems) => setItems((previous) => [...previous, ...newItems]),
      displayErrorMessage: (message) => displayToast(ToastType.Error, message, 0),
    };
    presenterRef.current = presenterFactory(view);
  }

  const presenter = presenterRef.current;
  const loadMoreItems = async (token: AuthToken, user: User): Promise<void> => {
    await presenter.loadMoreItems(token, user.alias);
  };

  useEffect(() => {
    setItems([]);
    presenter.reset();
    if (authToken && displayedUser) void loadMoreItems(authToken, displayedUser);
  }, [displayedUser, authToken, presenter]);

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={() => authToken && displayedUser ? loadMoreItems(authToken, displayedUser) : undefined}
        hasMore={presenter.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div key={itemKeyGenerator(item, index)} className="row mb-3 mx-0 px-0 border rounded bg-white">
            {itemComponentGenerator(item, navigateToUser)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default PagedItemScroller;
