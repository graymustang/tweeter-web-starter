import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../components/model.service/StatusService";

export interface PostStatusView {
  setLoading: (loading: boolean) => void;
  displayInfoMessage: (message: string) => string;
  deleteMessage: (id: string) => void;
  displaySuccessMessage: (message: string) => void;
  displayErrorMessage: (message: string) => void;
  clearStatus: () => void;
}

export class PostStatusPresenter {
  private readonly service = new StatusService();

  public constructor(private readonly view: PostStatusView) {}

  public canPost(text: string, authToken: AuthToken | null, user: User | null, isLoading: boolean): boolean {
    return !!text.trim() && !!authToken && !!user && !isLoading;
  }

  public async postStatus(
    text: string,
    authToken: AuthToken | null,
    user: User | null,
  ): Promise<void> {
    if (!authToken || !user || !text.trim()) return;
    let messageId = "";
    try {
      this.view.setLoading(true);
      messageId = this.view.displayInfoMessage("Posting status...");
      await this.service.postStatus(authToken, new Status(text, user, Date.now()));
      this.view.clearStatus();
      this.view.displaySuccessMessage("Status posted!");
    } catch (error) {
      this.view.displayErrorMessage(`Failed to post the status because of exception: ${error}`);
    } finally {
      if (messageId) this.view.deleteMessage(messageId);
      this.view.setLoading(false);
    }
  }
}
