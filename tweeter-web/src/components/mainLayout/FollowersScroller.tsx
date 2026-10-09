import { FollowerPresenter } from "../../presenter/FollowerPresenter";
import { UserItemView } from "../../presenter/UserItemPresenter";
import UserItemScroller from "./UserItemScroller";

const FollowersScroller = () => (
  <UserItemScroller
    featurePath="/followers"
    presenterFactory={(view: UserItemView) => new FollowerPresenter(view)}
  />
);

export default FollowersScroller;
