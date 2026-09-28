import { AuthToken, FakeData, Status } from "tweeter-shared";
import StatusItemScroller from "./StatusItemScroller";

const StoryScroller = () => {
  const loadMoreStoryItems = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };

  return (
    <StatusItemScroller
      featurePath="/story"
      itemDescription="story items"
      loadMoreItems={loadMoreStoryItems}
    />
  );
};

export default StoryScroller;