import { AuthToken, FakeData, User } from "tweeter-shared";
import UserItemScroller from "./UserItemScroller";

const FolloweesScroller = () => {
  return (
    <UserItemScroller
      featurePath="/followees"
      loadMoreItems={loadMoreFollowees}
      itemDescription="followees"
    />
  );
};

export default FolloweesScroller;