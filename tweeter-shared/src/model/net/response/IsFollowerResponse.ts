import type { TweeterResponse } from "./TweeterResponse";

export interface IsFollowerResponse extends TweeterResponse {
  readonly isFollower: boolean;
}
