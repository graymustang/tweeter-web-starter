import type { TweeterResponse } from "./TweeterResponse";
import type { UserDto } from "../../dto/UserDto";

export interface AuthResponse extends TweeterResponse {
  readonly user: UserDto | null;
  readonly token: string | null;
}
