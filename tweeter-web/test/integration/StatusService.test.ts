/** @jest-environment node */
import { AuthToken } from "tweeter-shared";
import { StatusService } from "../../src/model.service/StatusService";

describe("StatusService integration", () => {
  it("loads a user's story page", async () => {
    const statusService = new StatusService();
    const [statuses, hasMore] = await statusService.loadMoreStoryItems(
      new AuthToken("integration-test-token", Date.now()),
      "@allen",
      10,
      null,
    );

    expect(statuses.length).toBeGreaterThan(0);
    expect(statuses[0].post).toContain("Post 0 0");
    expect(statuses[0].user.alias).toBe("@allen");
    expect(typeof hasMore).toBe("boolean");
  });
});
