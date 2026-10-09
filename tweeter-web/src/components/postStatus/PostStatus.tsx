import "./PostStatus.css";
import { useState } from "react";
import { ToastType } from "../toaster/Toast";
import useUserInfo from "../hooks/useUserInfo";
import useMessageActions from "../hooks/useMessageActions";
import { PostStatusPresenter } from "../../presenter/PostStatusPresenter";

const PostStatus = () => {
  const { displayToast, deleteToast } = useMessageActions();

  const { currentUser, authToken } = useUserInfo();
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [presenter] = useState(() => new PostStatusPresenter({
    setLoading: setIsLoading,
    displayInfoMessage: (message) => displayToast(ToastType.Info, message, 0),
    deleteMessage: deleteToast,
    displaySuccessMessage: (message) => displayToast(ToastType.Info, message, 2000),
    displayErrorMessage: (message) => displayToast(ToastType.Error, message, 0),
    clearStatus: () => setPost(""),
  }));

  const submitPost = async (event: React.MouseEvent) => {
    event.preventDefault();

    await presenter.postStatus(post, authToken, currentUser);
  };

  const clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    setPost("");
  };

  const checkButtonStatus: () => boolean = () => {
    return !presenter.canPost(post, authToken, currentUser, isLoading);
  };

  return (
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
          rows={10}
          placeholder="What's on your mind?"
          value={post}
          onChange={(event) => {
            setPost(event.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <button
          id="postStatusButton"
          className="btn btn-md btn-primary me-1"
          type="button"
          disabled={checkButtonStatus()}
          style={{ width: "8em" }}
          onClick={submitPost}
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <div>Post Status</div>
          )}
        </button>
        <button
          id="clearStatusButton"
          className="btn btn-md btn-secondary"
          type="button"
          disabled={checkButtonStatus()}
          onClick={clearPost}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default PostStatus;
