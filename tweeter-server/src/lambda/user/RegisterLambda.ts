import { type AuthResponse, type RegisterRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { getDaoFactory } from "../../model/dao/DaoFactoryProvider";
import { withErrorMapping } from "../withErrorMapping";

const handle = async (request: RegisterRequest): Promise<AuthResponse> => {
  const [user, token] = await new UserService(getDaoFactory()).register(request.firstName, request.lastName, request.alias, request.password, request.imageBytes, request.imageFileExtension)
  return { success: true, message: null, user: user.dto, token: token.token }
}

export const handler = withErrorMapping(handle);
