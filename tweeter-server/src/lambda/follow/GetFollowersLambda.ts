import {PagedUserItemRequest,PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { getDaoFactory } from "../../model/dao/DaoFactoryProvider";
import { withErrorMapping } from "../withErrorMapping";

const handle = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  const followService = new FollowService(getDaoFactory());
  const [items, hasMore] = await followService.loadMoreFollowers(request.token, request.userAlias, request.pageSize, request.lastItem);

  return {
    success: true,
    message: null,
    items,
    hasMore,
  };
};
export const handler = withErrorMapping(handle);
