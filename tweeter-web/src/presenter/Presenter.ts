export interface View {
  displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
  displayInfoMessage: (message: string, duration?: number) => string;
  deleteMessage: (messageId: string) => void;
}

export abstract class Presenter<V extends View> {
  protected constructor(protected readonly view: V) {}

  protected async doFailureReportingOperation(
    operation: () => Promise<void>,
    operationDescription: string,
    onFailure?: (error: unknown) => void,
  ): Promise<void> {
    try {
      await operation();
    } catch (error) {
      if (onFailure) {
        onFailure(error);
      } else {
        this.view.displayErrorMessage(
          `Failed to ${operationDescription} because of exception: ${error}`,
        );
      }
    }
  }
}
