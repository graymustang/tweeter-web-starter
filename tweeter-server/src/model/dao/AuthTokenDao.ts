import type { AuthToken } from "tweeter-shared";
export interface AuthTokenDao {
  createToken(token: AuthToken, userAlias: string): Promise<void>;
  getToken(token: string): Promise<{ authToken: AuthToken; userAlias: string } | null>;
  touchToken(token: string, timestamp: number): Promise<void>;
  deleteToken(token: string): Promise<void>;
}
