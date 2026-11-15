import { AuthToken, User, type UserRequest, type UserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: UserRequest): Promise<UserResponse> => {
  const user = await new UserService().getUser(new AuthToken(request.token, Date.now()), request.alias);
  return { success:  true, message: null, user: user?.dto ?? null };
};
