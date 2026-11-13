export class ClientCommunicator {
  public constructor(private readonly serverUrl: string) {}

  public async doPost<REQ extends object, RES>(
    request: REQ,
    endpoint: string,
  ): Promise<RES> {
    const response = await fetch(`${this.serverUrl.replace(/\/$/, "")}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const responseBody: unknown = await response.json();

    if (!response.ok) {
      const errorBody = responseBody as {
        error?: string;
        errorMessage?: string;
        message?: string;
      };
      throw new Error(
        errorBody.errorMessage ??
          errorBody.error ??
          errorBody.message ??
          `Request failed with status ${response.status}`,
      );
    }

    return responseBody as RES;
  }
}
