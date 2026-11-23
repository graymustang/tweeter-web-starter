import { AuthToken, type LogoutRequest, type TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { getDaoFactory } from "../../model/dao/DaoFactoryProvider";
import { withErrorMapping } from "../withErrorMapping";

const handle = async (request: LogoutRequest): Promise<TweeterResponse> => {
  await new UserService(getDaoFactory()).logout(new AuthToken(request.token, Date.now()));
  return { success: true, message: null };
};

export const handler = withErrorMapping(handle);
