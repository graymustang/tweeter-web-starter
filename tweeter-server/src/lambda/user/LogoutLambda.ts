import { AuthToken, type LogoutRequest, type TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: LogoutRequest): Promise<TweeterResponse> => {
  await new UserService().logout(new AuthToken(request.token, Date.now()));
  return { success: true, message: null };
};
