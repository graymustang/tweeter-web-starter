import { Status, User, type PagedStatusItemRequest, type PagedStatusItemResponse, type StatusDto } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

const toDto = (status: Status): StatusDto => ({ post: status.post, user: status.user.dto, timestamp: status.timestamp });
export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
  const last = request.lastItem ? new Status(request.lastItem.post, User.fromDto(request.lastItem.user)!, request.lastItem.timestamp) : null;
  const [items, hasMore] = await new StatusService().loadMoreFeedItems(request.token, request.userAlias, request.pageSize, last);
  return { success: true, message: null, items: items.map(toDto), hasMore };
};
