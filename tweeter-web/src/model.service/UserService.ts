import { AuthToken, User } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

const serverFacade = new ServerFacade();

export class UserService implements Service {
  public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    return serverFacade.getUser({ token: authToken.token, alias });
  }

  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
    return serverFacade.login({ alias, password });
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
  ): Promise<[User, AuthToken]> {
    return serverFacade.register({
      firstName,
      lastName,
      alias,
      password,
      imageBytes: Array.from(imageBytes),
      imageFileExtension,
    });
  }

  public async logout(authToken: AuthToken): Promise<void> {
    return serverFacade.logout({ token: authToken.token });
  }
}
