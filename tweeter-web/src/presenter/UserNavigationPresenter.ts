import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View {
  setDisplayedUser: (user: User) => void;
  navigate: (path: string) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private readonly userService = new UserService();

  public constructor(
    view: UserNavigationView,
    private readonly featurePath: string,
  ) {
    super(view);
  }

  public async showUser(authToken: AuthToken, alias: string): Promise<void> {
    await this.loadUser(authToken, alias, (user) => this.view.setDisplayedUser(user));
  }

  public async navigateToUser(
    authToken: AuthToken,
    alias: string,
    currentUser: User | null,
  ): Promise<void> {
    await this.loadUser(authToken, alias, (user) => {
      if (user && (!currentUser || !user.equals(currentUser))) {
        this.view.setDisplayedUser(user);
        this.view.navigate(`${this.featurePath}/${user.alias}`);
      }
    });
  }

  private async loadUser(
    authToken: AuthToken,
    alias: string,
    onUserFound: (user: User) => void,
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const user = await this.userService.getUser(authToken, alias);
      if (user) onUserFound(user);
    }, "get user");
  }
}
