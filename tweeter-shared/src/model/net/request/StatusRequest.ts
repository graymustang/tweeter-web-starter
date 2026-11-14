import type { AuthRequest } from "./AuthRequest";

export interface StatusRequest extends AuthRequest {
  readonly post: string;
  readonly userAlias: string;
  readonly timestamp: number;
}
