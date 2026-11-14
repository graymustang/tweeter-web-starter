import type { TweeterResponse } from "./TweeterResponse";
import type { StatusDto } from "../../dto/StatusDto";

export interface PagedStatusItemResponse extends TweeterResponse {
  readonly items: StatusDto[] | null;
  readonly hasMore: boolean;
}
