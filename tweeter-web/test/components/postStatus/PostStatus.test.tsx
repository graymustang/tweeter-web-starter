import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { AuthToken, User } from "tweeter-shared";
import { anything, instance, mock, verify, when } from "@typestrong/ts-mockito";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import useUserInfo from "../../../src/components/hooks/useUserInfo";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";

jest.mock("../../../src/components/hooks/useUserInfo", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockUserInstance = new User("Test", "User", "@test", "image-url");
const mockAuthTokenInstance = new AuthToken("test-token", 123456789);
const statusText = "A status to post";

describe("PostStatus Component", () => {
  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      displayedUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it("starts with the Post Status and Clear buttons disabled", () => {
    const { postStatusButton, clearButton } = renderPostStatusAndGetElements();

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables both buttons when the text field has text", async () => {
    const { postStatusButton, clearButton, statusField, user } =
      renderPostStatusAndGetElements();

    await user.type(statusField, statusText);

    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables both buttons when the text field is cleared", async () => {
    const { postStatusButton, clearButton, statusField, user } =
      renderPostStatusAndGetElements();

    await user.type(statusField, statusText);
    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.clear(statusField);

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls the presenter's postStatus method with the status, auth token, and user", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    when(mockPresenter.canPost(anything(), anything(), anything(), anything()),).thenReturn(true);

    const { postStatusButton, statusField, user } =
      renderPostStatusAndGetElements(mockPresenterInstance);

    await user.type(statusField, statusText);
    await user.click(postStatusButton);

    verify(
      mockPresenter.postStatus(statusText, mockAuthTokenInstance, mockUserInstance,),).once();
  });
});

function renderPostStatusAndGetElements(presenter?: PostStatusPresenter) {
  const user = userEvent.setup();
  render(<PostStatus presenter={presenter} />);

  const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const statusField = screen.getByRole("textbox");

  return { user, postStatusButton, clearButton, statusField };
}
