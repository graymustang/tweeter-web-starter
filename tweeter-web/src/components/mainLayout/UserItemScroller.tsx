import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { User } from "tweeter-shared";
import { UserItemPresenter, UserItemView } from "../../presenter/UserItemPresenter";
import UserItem from "../userItem/UserItem";
import useUserInfo from "../hooks/useUserInfo";
import useMessageActions from "../hooks/useMessageActions";
import useUserNavigation from "../hooks/useUserNavigation";
import { ToastType } from "../toaster/Toast";

interface Props {
  featurePath: string;
  presenterFactory: (view: UserItemView) => UserItemPresenter;
}

const UserItemScroller = (props: Props) => {
  const { displayedUser, authToken } = useUserInfo();
  const { displayToast } = useMessageActions();
  const { navigateToUser } = useUserNavigation(props.featurePath);
  const [items, setItems] = useState<User[]>([]);
  const presenterRef = useRef<UserItemPresenter | null>(null);

  if (!presenterRef.current) {
    const view: UserItemView = {
      addItems: (newItems) => setItems((previous) => [...previous, ...newItems]),
      displayErrorMessage: (message) => displayToast(ToastType.Error, message, 0),
    };
    presenterRef.current = props.presenterFactory(view);
  }

  const presenter = presenterRef.current;
  const reset = () => {
    setItems([]);
    presenter.reset();
  };
  const loadMoreItems = async () => {
    if (authToken && displayedUser) {
      await presenter.loadMoreItems(authToken, displayedUser.alias);
    }
  };

  useEffect(() => {
    reset();
    void loadMoreItems();
  }, [displayedUser, authToken]);

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenter.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div key={`${item.alias}-${index}`} className="row mb-3 mx-0 px-0 border rounded bg-white">
            <UserItem user={item} featurePath={props.featurePath} navigateToUser={navigateToUser} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default UserItemScroller;
