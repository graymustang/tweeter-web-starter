import type { TweeterResponse } from "./TweeterResponse";

export interface CountResponse extends TweeterResponse {
  readonly count: number;
}
