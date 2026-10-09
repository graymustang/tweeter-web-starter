import { AuthToken, FakeData, User } from "tweeter-shared";
import UserItemScroller from "./UserItemScroller";

const FollowersScroller = () => {
  

  return (
    <UserItemScroller
      featurePath="/followers"
      loadMoreItems={loadMoreFollowers}
      itemDescription="followers"
    />
  );
};

export default FollowersScroller;