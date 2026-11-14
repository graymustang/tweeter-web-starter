import type { AuthRequest } from "./AuthRequest";
import type { StatusDto } from "../../dto/StatusDto";

export interface PagedStatusItemRequest extends AuthRequest {
  readonly userAlias: string;
  readonly pageSize: number;
  readonly lastItem: StatusDto | null;
}
