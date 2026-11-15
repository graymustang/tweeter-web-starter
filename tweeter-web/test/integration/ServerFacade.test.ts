/** @jest-environment node */
import { User } from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";

describe("ServerFacade integration", () => {
  const serverFacade = new ServerFacade();

  it("registers and returns Allen Anderson with an authentication token", async () => {
    const [user, authToken] = await serverFacade.register({
      firstName: "Test",
      lastName: "User",
      alias: "@integration-test",
      password: "test-password",
      imageBytes: [],
      imageFileExtension: "png",
    });

    expect(user).toEqual(new User("Allen", "Anderson", "@allen", user.imageUrl));
    expect(authToken.token).toBeTruthy();
  });

  it("returns a page of followers", async () => {
    const [followers, hasMore] = await serverFacade.getMoreFollowers({
      token: "integration-test-token",
      userAlias: "@allen",
      pageSize: 10,
      lastItem: null,
    });

    expect(followers.length).toBeGreaterThan(0);
    expect(followers[0]).toEqual(
      new User("Amy", "Ames", "@amy", followers[0].imageUrl),
    );
    expect(typeof hasMore).toBe("boolean");
  });

  it("returns positive follower and followee counts", async () => {
    const request = {
      token: "integration-test-token",
      user: new User("Allen", "Anderson", "@allen", "").dto,
    };

    await expect(serverFacade.getFollowerCount(request)).resolves.toBeGreaterThan(0);
    await expect(serverFacade.getFolloweeCount(request)).resolves.toBeGreaterThan(0);
  });
});
