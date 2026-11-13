import type { UserDto } from "../../dto/UserDto";

export interface CountRequest {
  readonly token: string;
  readonly user: UserDto;
}
