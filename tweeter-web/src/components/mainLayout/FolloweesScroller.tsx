import { FolloweePresenter } from "../../presenter/FolloweePresenter";
import { UserItemView } from "../../presenter/UserItemPresenter";
import UserItemScroller from "./UserItemScroller";

const FolloweesScroller = () => (
  <UserItemScroller
    featurePath="/followees"
    presenterFactory={(view: UserItemView) => new FolloweePresenter(view)}
  />
);

export default FolloweesScroller;
