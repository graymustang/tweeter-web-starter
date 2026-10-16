import { AuthToken, User } from "tweeter-shared";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface LoginView extends AuthenticationView {
  loginSucceeded: (user: User, authToken: AuthToken, remember: boolean) => void;
}

export class LoginPresenter extends AuthenticationPresenter<LoginView> {
  public constructor(view: LoginView) {
    super(view);
  }

  public canSubmit(alias: string, password: string): boolean {
    return alias.trim().length > 0 && password.length > 0;
  }

  public async login(alias: string, password: string, remember: boolean): Promise<void> {
    if (!this.canSubmit(alias, password)) return;
    await this.doAuthenticationOperation(
      () => this.service.login(alias, password),
      (user, authToken) => this.view.loginSucceeded(user, authToken, remember),
      "log user in",
    );
  }
}
