import { AuthToken, User } from "tweeter-shared";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

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

