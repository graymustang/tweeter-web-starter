import type { AuthRequest } from "./AuthRequest";
import type { UserDto } from "../../dto/UserDto";

export interface FollowRequest extends AuthRequest {
  readonly user: UserDto;
}
