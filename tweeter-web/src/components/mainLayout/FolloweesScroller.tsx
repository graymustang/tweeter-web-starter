import { AuthToken, FakeData, User } from "tweeter-shared";
import UserItemScroller from "./UserItemScroller";

const FolloweesScroller = () => {
  const loadMoreFollowees = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastFollowee: User | null
  ): Promise<[User[], boolean]> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfUsers(
      lastFollowee,
      pageSize,
      userAlias
    );
  };

  return (
    <UserItemScroller
      featurePath="/followees"
      loadMoreItems={loadMoreFollowees}
      itemDescription="followees"
    />
  );
};

export default FolloweesScroller;