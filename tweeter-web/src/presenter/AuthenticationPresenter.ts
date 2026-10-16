import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface AuthenticationView extends View {
  setLoading: (loading: boolean) => void;
}

export abstract class AuthenticationPresenter<V extends AuthenticationView>
  extends Presenter<V> {
  protected readonly service = new UserService();

  protected async doAuthenticationOperation(
    operation: () => Promise<[User, AuthToken]>,
    notify: (user: User, authToken: AuthToken) => void,
    operationDescription: string,
  ): Promise<void> {
    this.view.setLoading(true);
    try {
      await this.doFailureReportingOperation(async () => {
        const [user, authToken] = await operation();
        notify(user, authToken);
      }, operationDescription);
    } finally {
      this.view.setLoading(false);
    }
  }
}
