import type { DaoFactory } from "../dao/DaoFactory";

const tokenLifetimeMs = Number(process.env.AUTH_TOKEN_TTL_SECONDS ?? 1800) * 1000;

/** Validates a session token and refreshes its inactivity timeout. */
export class AuthorizationService {
  public constructor(private readonly daoFactory: DaoFactory) {}

  public async authorize(token: string): Promise<string> {
    const tokenDao = this.daoFactory.getAuthTokenDao();
    const session = await tokenDao.getToken(token);
    const now = Date.now();
    if (!session || now - session.authToken.timestamp > tokenLifetimeMs || now < session.authToken.timestamp) {
      if (session) await tokenDao.deleteToken(token);
      throw new Error("unauthorized: A valid, active authentication token is required");
    }

    await tokenDao.touchToken(token, now);
    return session.userAlias;
  }
}
