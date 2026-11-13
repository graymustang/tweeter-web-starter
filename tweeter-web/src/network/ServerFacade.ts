import {
  CountRequest,
  CountResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  User,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private readonly clientCommunicator = new ClientCommunicator(
    "https://m9wa4vd2ja.execute-api.us-east-1.amazonaws.com/prod",
  );

  public async getMoreFollowees(
    request: PagedUserItemRequest,
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/followee/list");

    if (!response.success) {
      throw new Error(response.message ?? "Failed to get followees");
    }

    if (response.items == null) {
      throw new Error("The server returned no followees");
    }

    const users = response.items.map((dto) => User.fromDto(dto) as User);
    return [users, response.hasMore];
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest,
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follower/list");

    if (!response.success) {
      throw new Error(response.message ?? "Failed to get followers");
    }

    if (response.items == null) {
      throw new Error("The server returned no followers");
    }

    const users = response.items.map((dto) => User.fromDto(dto) as User);
    return [users, response.hasMore];
  }

  public async getFollowerCount(request: CountRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      CountRequest,
      CountResponse
    >(request, "/follower/count");
    if (!response.success) {
      throw new Error(response.message ?? "Failed to get follower count");
    }

    return response.count;
  }

  public async getFolloweeCount(request: CountRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      CountRequest,
      CountResponse
    >(request, "/followee/count");
    if (!response.success) {
      throw new Error(response.message ?? "Failed to get followee count");
    }

    return response.count;
  }
}
