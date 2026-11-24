import { AuthToken, type FollowRequest, type FollowResponse, User } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { getDaoFactory } from "../../model/dao/DaoFactoryProvider";
import { withErrorMapping } from "../withErrorMapping";

const handle = async (request: FollowRequest): Promise<FollowResponse> => {
  const user = User.fromDto(request.user);
  if (!user) throw new Error("A user is required to unfollow");
  const [followerCount, followeeCount] = await new FollowService(getDaoFactory()).unfollow(new AuthToken(request.token, Date.now()), user);
  return { success: true, message: null, followerCount, followeeCount };
};

export const handler = withErrorMapping(handle);
