import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
  setLoading: (loading: boolean) => void;
  displaySuccessMessage: (message: string) => void;
  clearStatus: () => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private readonly service = new StatusService();

  public constructor(view: PostStatusView) {
    super(view);
  }

  public canPost(text: string, authToken: AuthToken | null, user: User | null, isLoading: boolean): boolean {
    return !!text.trim() && !!authToken && !!user && !isLoading;
  }

  public async postStatus(
    text: string,
    authToken: AuthToken | null,
    user: User | null,
  ): Promise<void> {
    if (!authToken || !user || !text.trim()) return;
    await this.doFailureReportingOperation(async () => {
      let messageId = "";
      this.view.setLoading(true);
      try {
        messageId = this.view.displayInfoMessage("Posting status...");
        await this.service.postStatus(authToken, new Status(text, user, Date.now()));
        this.view.clearStatus();
        this.view.displaySuccessMessage("Status posted!");
      } finally {
        if (messageId) this.view.deleteMessage(messageId);
        this.view.setLoading(false);
      }
    }, "post the status");
  }
}
