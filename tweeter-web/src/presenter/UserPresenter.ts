import { AuthToken, User } from "tweeter-shared";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model.service/UserService";

export interface RegisterView extends AuthenticationView {
  registrationSucceeded: (user: User, authToken: AuthToken, remember: boolean) => void;
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView> {
  public constructor(view: RegisterView) {
    super(view);
  }

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
    await this.doAuthenticationOperation(
      () => this.service.register(
        firstName, lastName, alias, password, imageBytes, imageFileExtension,
      ),
      (user, authToken) => this.view.registrationSucceeded(user, authToken, remember),
      "register user",
    );
  }
}

export interface LogoutView extends View {
  displayProgressMessage: (message: string) => string;
  deleteMessage: (id: string) => void;
  logoutSucceeded: () => void;
}

export class LogoutPresenter extends Presenter<LogoutView> {
  private readonly service = new UserService();

  public constructor(view: LogoutView) {
    super(view);
  }

  public async logout(authToken: AuthToken | null): Promise<void> {
    if (!authToken) return;
    const messageId = this.view.displayProgressMessage("Logging Out...");
    try {
      await this.doFailureReportingOperation(async () => {
        await this.service.logout(authToken);
        this.view.logoutSucceeded();
      }, "log user out");
    } finally {
      this.view.deleteMessage(messageId);
    }
  }
}
