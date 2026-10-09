import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../components/model.service/UserService";

interface AuthenticationView {
  setLoading: (loading: boolean) => void;
  displayErrorMessage: (message: string) => void;
}

export interface LoginView extends AuthenticationView {
  loginSucceeded: (user: User, authToken: AuthToken, remember: boolean) => void;
}

export class LoginPresenter {
  private readonly service = new UserService();

  public constructor(private readonly view: LoginView) {}

  public canSubmit(alias: string, password: string): boolean {
    return alias.trim().length > 0 && password.length > 0;
  }

  public async login(alias: string, password: string, remember: boolean): Promise<void> {
    if (!this.canSubmit(alias, password)) return;
    try {
      this.view.setLoading(true);
      const [user, authToken] = await this.service.login(alias, password);
      this.view.loginSucceeded(user, authToken, remember);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to log user in because of exception: ${error}`);
    } finally {
      this.view.setLoading(false);
    }
  }
}

export interface RegisterView extends AuthenticationView {
  registrationSucceeded: (user: User, authToken: AuthToken, remember: boolean) => void;
}

export class RegisterPresenter {
  private readonly service = new UserService();

  public constructor(private readonly view: RegisterView) {}

  public canSubmit(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
  ): boolean {
    return !!firstName.trim() && !!lastName.trim() && !!alias.trim() && !!password &&
      imageBytes.length > 0 && !!imageFileExtension;
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    remember: boolean,
  ): Promise<void> {
    if (!this.canSubmit(firstName, lastName, alias, password, imageBytes, imageFileExtension)) return;
    try {
      this.view.setLoading(true);
      const [user, authToken] = await this.service.register(
        firstName, lastName, alias, password, imageBytes, imageFileExtension,
      );
      this.view.registrationSucceeded(user, authToken, remember);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to register user because of exception: ${error}`);
    } finally {
      this.view.setLoading(false);
    }
  }
}

export interface LogoutView {
  displayProgressMessage: (message: string) => string;
  deleteMessage: (id: string) => void;
  logoutSucceeded: () => void;
  displayErrorMessage: (message: string) => void;
}

export class LogoutPresenter {
  private readonly service = new UserService();

  public constructor(private readonly view: LogoutView) {}

  public async logout(authToken: AuthToken | null): Promise<void> {
    if (!authToken) return;
    const messageId = this.view.displayProgressMessage("Logging Out...");
    try {
      await this.service.logout(authToken);
      this.view.logoutSucceeded();
    } catch (error) {
      this.view.displayErrorMessage(`Failed to log user out because of exception: ${error}`);
    } finally {
      this.view.deleteMessage(messageId);
    }
  }
}
