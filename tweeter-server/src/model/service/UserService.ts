import { AuthToken, FakeData, User } from "tweeter-shared";

export class UserService {
  public async getUser(_token: AuthToken, alias: string): Promise<User | null> {
    return FakeData.instance.findUserByAlias(alias);
  }

  public async login(_alias: string, _password: string): Promise<[User, AuthToken]> {
    const user = FakeData.instance.firstUser;
    if (!user) throw new Error("Invalid alias or password");
    return [user, FakeData.instance.authToken];
  }

  public async register( _firstName: string, _lastName: string, _alias: string, _password: string, _imageBytes: number[], _imageFileExtension: string): Promise<[User, AuthToken]> {
    const user = FakeData.instance.firstUser;
    if (!user) throw new Error("Unable to register user");
    return [user, FakeData.instance.authToken];
  }

  public async logout(_token: AuthToken): Promise<void> {}
}
