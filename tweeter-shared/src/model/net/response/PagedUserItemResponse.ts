import type { UserDto } from "../../dto/UserDto";
import type { TweeterResponse } from "./TweeterResponse";

export interface PagedUserItemResponse extends TweeterResponse {
  readonly items: UserDto[] | null;
  readonly hasMore: boolean;
}
