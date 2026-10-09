import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../components/model.service/UserService";

export interface UserNavigationView {
  setDisplayedUser: (user: User) => void;
  navigate: (path: string) => void;
  displayErrorMessage: (message: string) => void;
}

export class UserNavigationPresenter {
  private readonly userService = new UserService();

  public constructor(
    private readonly view: UserNavigationView,
    private readonly featurePath: string,
  ) {}

  public async showUser(authToken: AuthToken, alias: string): Promise<void> {
    try {
      const user = await this.userService.getUser(authToken, alias);
      if (user) this.view.setDisplayedUser(user);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  }

  public async navigateToUser(
    authToken: AuthToken,
    alias: string,
    currentUser: User | null,
  ): Promise<void> {
    try {
      const user = await this.userService.getUser(authToken, alias);
      if (user && (!currentUser || !user.equals(currentUser))) {
        this.view.setDisplayedUser(user);
        this.view.navigate(`${this.featurePath}/${user.alias}`);
      }
    } catch (error) {
      this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  }
}
