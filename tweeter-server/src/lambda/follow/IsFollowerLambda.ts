import {AuthToken, IsFollowerRequest, IsFollowerResponse, User} from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { getDaoFactory } from "../../model/dao/DaoFactoryProvider";
import { withErrorMapping } from "../withErrorMapping";

const handle = async (request: IsFollowerRequest): Promise<IsFollowerResponse> => {
  const user = User.fromDto(request.user);
  const selectedUser = User.fromDto(request.selectedUser);
  if (user == null || selectedUser == null) {
    throw new Error("Both users are required to check follower status");
  }

  const authToken = new AuthToken(request.token, Date.now());
  const followService = new FollowService(getDaoFactory());
  const isFollower = await followService.getIsFollower(authToken,user,  selectedUser);

  return {success: true,
  message: null,
    isFollower,
  };
};

export const handler = withErrorMapping(handle);
