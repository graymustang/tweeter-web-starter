import { AuthToken, Status, User, type AuthResponse, type CountRequest, type CountResponse, type FollowRequest, type FollowResponse, type IsFollowerRequest, type IsFollowerResponse, type LoginRequest, type LogoutRequest, type PagedStatusItemRequest, type PagedStatusItemResponse, type PagedUserItemRequest, type PagedUserItemResponse, type RegisterRequest, type StatusRequest, type TweeterResponse, type UserRequest, type UserResponse,
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
    this.ensureSuccess(response, "Failed to get followees");
    if (response.items == null) throw new Error("The server returned no followees");
    return [response.items.map((dto) => User.fromDto(dto)!), response.hasMore];
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest,
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follower/list");
    this.ensureSuccess(response, "Failed to get followers");
    if (response.items == null) throw new Error("The server returned no followers");
    return [response.items.map((dto) => User.fromDto(dto)!), response.hasMore];
  }

  public async getFollowerCount(request: CountRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<CountRequest, CountResponse>(
      request,
      "/follower/count",
    );
    this.ensureSuccess(response, "Failed to get follower count");
    return response.count;
  }

  public async getFolloweeCount(request: CountRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<CountRequest, CountResponse>(
      request,
      "/followee/count",
    );
    this.ensureSuccess(response, "Failed to get followee count");
    return response.count;
  }

  public async getIsFollower(request: IsFollowerRequest): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
    >(request, "/follower/is-follower");
    this.ensureSuccess(response, "Failed to check follower status");
    return response.isFollower;
  }

  public async follow(request: FollowRequest): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<FollowRequest, FollowResponse>( request, "/follow/follow" );
    this.ensureSuccess(response, "Failed to follow user");
    return [response.followerCount, response.followeeCount];
  }

  public async unfollow(request: FollowRequest): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<FollowRequest, FollowResponse>( request,"/follow/unfollow");
    this.ensureSuccess(response, "Failed to unfollow user");
    return [response.followerCount, response.followeeCount];
  }

  public async getUser(request: UserRequest): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<UserRequest, UserResponse>(request, "/user/get");
    this.ensureSuccess(response, "Failed to get user");
    return User.fromDto(response.user);
  }

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<LoginRequest, AuthResponse>(
      request,
      "/user/login",
    );
    this.ensureSuccess(response, "Failed to log in");
    return this.getAuthenticatedUser(response, "login");
  }

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<RegisterRequest, AuthResponse>(
      request,
      "/user/register",
    );
    this.ensureSuccess(response, "Failed to register");
    return this.getAuthenticatedUser(response, "registration");
  }

  public async logout(request: LogoutRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<LogoutRequest, TweeterResponse>(
      request,
      "/user/logout",
    );
    this.ensureSuccess(response, "Failed to log out");
  }

  public async getMoreFeedItems(
    request: PagedStatusItemRequest,
  ): Promise<[Status[], boolean]> {
    return this.getMoreStatuses(request, "/status/feed", "Failed to get feed items");
  }

  public async getMoreStoryItems(
    request: PagedStatusItemRequest,
  ): Promise<[Status[], boolean]> {
    return this.getMoreStatuses(request, "/status/story", "Failed to get story items");
  }

  public async postStatus(request: StatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<StatusRequest, TweeterResponse>(
      request,
      "/status/post",
    );
    this.ensureSuccess(response, "Failed to post status");
  }

  private async getMoreStatuses(request: PagedStatusItemRequest,endpoint: string, errorMessage: string,): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, endpoint);
    this.ensureSuccess(response, errorMessage);
    if (response.items == null) throw new Error("The server returned no statuses");
    const statuses = response.items.map(
      (dto) => new Status(dto.post, User.fromDto(dto.user)!, dto.timestamp),
    );
    return [statuses, response.hasMore];
  }

  private getAuthenticatedUser(
    response: AuthResponse,
    operation: string,
  ): [User, AuthToken] {
    const user = User.fromDto(response.user);
    if (user == null || response.token == null) {
      throw new Error(`The server returned incomplete ${operation} information`);
    }
    return [user, new AuthToken(response.token, Date.now())];
  }

  private ensureSuccess(
    response: TweeterResponse,
    fallbackMessage: string,
  ): void {
    if (!response.success) throw new Error(response.message ?? fallbackMessage);
  }
}
