import { type AuthResponse, type LoginRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { getDaoFactory } from "../../model/dao/DaoFactoryProvider";
import { withErrorMapping } from "../withErrorMapping";

const handle = async (request: LoginRequest): Promise<AuthResponse> => {
  const [user, token] = await new UserService(getDaoFactory()).login(request.alias, request.password);
  return { success: true, message: null, user: user.dto, token: token.token };
};

export const handler = withErrorMapping(handle);
