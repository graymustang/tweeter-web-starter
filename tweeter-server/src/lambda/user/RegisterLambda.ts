import { type AuthResponse, type RegisterRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: RegisterRequest): Promise<AuthResponse> => {
  const [user, token] = await new UserService().register( request.firstName, request.lastName, request.alias, request.password, request.imageBytes, request.imageFileExtension);
  return { success: true, message: null, user: user.dto, token: token.token };
};
