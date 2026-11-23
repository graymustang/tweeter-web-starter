import { AuthToken, type UserRequest, type UserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { getDaoFactory } from "../../model/dao/DaoFactoryProvider";
import { withErrorMapping } from "../withErrorMapping";

const handle = async (request: UserRequest): Promise<UserResponse> => {
  const user = await new UserService(getDaoFactory()).getUser(new AuthToken(request.token, Date.now()), request.alias);
  return { success:  true, message: null, user: user?.dto ?? null };
};

export const handler = withErrorMapping(handle);
