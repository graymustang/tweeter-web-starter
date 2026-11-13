import { AuthToken, CountRequest, CountResponse, User } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: CountRequest,
): Promise<CountResponse> => {
  const user = User.fromDto(request.user);
  if (user == null) {
    throw new Error("A user is required to get the follower count");
  }

  const followService = new FollowService();
  const authToken = new AuthToken(request.token, Date.now());
  const count = await followService.getFollowerCount(authToken, user);

  return {
    success: true,
    message: null,
    count,
  };
};
