import type { TweeterResponse } from "./TweeterResponse";
import type { UserDto } from "../../dto/UserDto";

export interface UserResponse extends TweeterResponse {
  readonly user: UserDto | null;
}
