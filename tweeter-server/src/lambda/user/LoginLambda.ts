import { type AuthResponse, type LoginRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: LoginRequest): Promise<AuthResponse> => {
  const [user, token] = await new UserService().login(request.alias, request.password);
  return { success: true, message: null, user: user.dto, token: token.token };
};
