import { AuthToken, FakeData, User } from "tweeter-shared";

export class UserService {
  public async getUser(_authToken: AuthToken, alias: string): Promise<User | null> {
    return FakeData.instance.findUserByAlias(alias);
  }

  public async login(_alias: string, _password: string): Promise<[User, AuthToken]> {
    const user = FakeData.instance.firstUser;
    if (!user) throw new Error("Invalid alias or password");
    return [user, FakeData.instance.authToken];
  }

  public async register(
    _firstName: string,
    _lastName: string,
    _alias: string,
    _password: string,
    _imageBytes: Uint8Array,
    _imageFileExtension: string,
  ): Promise<[User, AuthToken]> {
    const user = FakeData.instance.firstUser;
    if (!user) throw new Error("Invalid registration");
    return [user, FakeData.instance.authToken];
  }

  public async logout(_authToken: AuthToken): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
