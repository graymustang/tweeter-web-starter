import { useEffect, useRef, useState } from "react";
import { Status } from "tweeter-shared";
import InfiniteScroll from "react-infinite-scroll-component";
import StatusItem from "../statusItem/statusItem";
import useUserInfo from "../hooks/useUserInfo";
import useUserNavigation from "../hooks/useUserNavigation";
import useMessageActions from "../hooks/useMessageActions";
import { ToastType } from "../toaster/Toast";
import { StatusItemPresenter, StatusListType } from "../../presenter/StatusItemPresenter";

interface Props {
  featurePath: string;
  listType: StatusListType;
}

const StatusItemScroller = ({ featurePath, listType }: Props) => {
  const { displayToast } = useMessageActions();
  const { displayedUser, authToken } = useUserInfo();
  const { navigateToUser } = useUserNavigation(featurePath);
  const [items, setItems] = useState<Status[]>([]);
  const presenterRef = useRef<StatusItemPresenter | null>(null);

  if (!presenterRef.current) {
    presenterRef.current = new StatusItemPresenter(
      {
        addItems: (newItems) => setItems((previous) => [...previous, ...newItems]),
        displayErrorMessage: (message) => displayToast(ToastType.Error, message, 0),
      },
      listType,
    );
  }

  const presenter = presenterRef.current;
  useEffect(() => {
    setItems([]);
    presenter.reset();
    if (authToken && displayedUser) void presenter.loadMoreItems(authToken, displayedUser.alias);
  }, [displayedUser, authToken, presenter]);

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={() => authToken && displayedUser ? presenter.loadMoreItems(authToken, displayedUser.alias) : undefined}
        hasMore={presenter.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div key={`${item.timestamp}-${index}`} className="row mb-3 mx-0 px-0 border rounded bg-white">
            <StatusItem status={item} featurePath={featurePath} navigateToUser={navigateToUser} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default StatusItemScroller;
