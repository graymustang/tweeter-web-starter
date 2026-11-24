import { AuthToken, CountRequest, CountResponse, User } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { getDaoFactory } from "../../model/dao/DaoFactoryProvider";
import { withErrorMapping } from "../withErrorMapping";

const handle = async (
  request: CountRequest): Promise<CountResponse> => {
  const user = User.fromDto(request.user);
  if (user == null) {
    throw new Error("A user is required to get the follower count");
  }

  const followService = new FollowService(getDaoFactory());
  const authToken = new AuthToken(request.token, Date.now());
  const count = await followService.getFollowerCount(authToken, user);

  return {
    success: true,
    message: null,
    count,
  };
};

export const handler = withErrorMapping(handle);
