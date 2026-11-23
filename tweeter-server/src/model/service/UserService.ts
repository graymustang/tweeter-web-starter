import { compare, hash } from "bcryptjs";
import { AuthToken, User } from "tweeter-shared";
import type { DaoFactory } from "../dao/DaoFactory";
import { AuthorizationService } from "./AuthorizationService";

const passwordHashRounds = 10;

export class UserService {
  private readonly authorizationService: AuthorizationService;

  public constructor(private readonly daoFactory: DaoFactory) {
    this.authorizationService = new AuthorizationService(daoFactory);
  }

  public async getUser(token: AuthToken, alias: string): Promise<User | null> {
    await this.authorizationService.authorize(token.token);
    return this.daoFactory.getUserDao().getUser(alias);
  }

  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
    const userDao = this.daoFactory.getUserDao();
    const [user, passwordHash] = await Promise.all([
      userDao.getUser(alias),
      userDao.getPasswordHash(alias),
    ]);
    if (!user || !passwordHash || !(await compare(password, passwordHash))) {
      throw new Error("unauthorized: Invalid alias or password");
    }

    const token = AuthToken.Generate();
    await this.daoFactory.getAuthTokenDao().createToken(token, user.alias);
    return [user, token];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: number[],
    imageFileExtension: string,
  ): Promise<[User, AuthToken]> {
    const normalizedAlias = alias.trim();
    if (!firstName.trim() || !lastName.trim() || !normalizedAlias || !password || imageBytes.length === 0) {
      throw new Error("bad-request: Name, alias, a password, and an image are required");
    }
    if (await this.daoFactory.getUserDao().getUser(normalizedAlias)) {
      throw new Error("bad-request: That alias is already registered");
    }

    const [passwordHash, imageUrl] = await Promise.all([
      hash(password, passwordHashRounds),
      this.daoFactory.getImageDao().putImage(normalizedAlias, imageBytes, imageFileExtension),
    ]);
    const user = new User(firstName.trim(), lastName.trim(), normalizedAlias, imageUrl);
    await this.daoFactory.getUserDao().createUser(user, passwordHash);

    const token = AuthToken.Generate();
    await this.daoFactory.getAuthTokenDao().createToken(token, user.alias);
    return [user, token];
  }

  public async logout(token: AuthToken): Promise<void> {
    await this.authorizationService.authorize(token.token);
    await this.daoFactory.getAuthTokenDao().deleteToken(token.token);
  }
}
