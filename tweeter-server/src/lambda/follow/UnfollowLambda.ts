import { AuthToken, type FollowRequest, type FollowResponse, User } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: FollowRequest): Promise<FollowResponse> => {
  const user = User.fromDto(request.user);
  if (!user) throw new Error("A user is required to unfollow");
  const [followerCount, followeeCount] = await new FollowService().unfollow( new AuthToken(request.token, Date.now()), user);
  return { success: true, message: null, followerCount, followeeCount };
};
