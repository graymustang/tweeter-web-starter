import { AuthToken, CountRequest, CountResponse, User } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: CountRequest): Promise<CountResponse> => {
  const user = User.fromDto(request.user);
  if (user == null) {
    throw new Error("A user is required to get the followee count");
  }

  const followService = new FollowService();
  const authToken = new AuthToken(request.token, Date.now());
  const count = await followService.getFolloweeCount(authToken, user);

  return {
    success: true,
    message: null,
    count,
  };
};
