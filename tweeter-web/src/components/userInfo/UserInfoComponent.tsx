import "./UserInfoComponent.css";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastType } from "../toaster/Toast";
import useUserInfo from "../hooks/useUserInfo";
import useUserInfoActions from "../hooks/useUserInfoActions";
import useMessageActions from "../hooks/useMessageActions";
import { UserInfoPresenter } from "../../presenter/UserInfoPresenter";

const UserInfo = () => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const { displayToast, deleteToast } = useMessageActions();
  const { currentUser, authToken, displayedUser } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();
  const location = useLocation();
  const [presenter] = useState(() => new UserInfoPresenter({
    setUserInfo: (follower, followees, followers) => {
      setIsFollower(follower);
      setFolloweeCount(followees);
      setFollowerCount(followers);
    },
    setLoading: setIsLoading,
    displayInfoMessage: (message) => displayToast(ToastType.Info, message, 0),
    deleteMessage: deleteToast,
    displayErrorMessage: (message) => displayToast(ToastType.Error, message, 0),
    currentUserSelected: (selectedUser, path) => {
      setDisplayedUser(selectedUser);
      navigate(path);
    },
  }));
  const user = displayedUser ?? currentUser;

  useEffect(() => {
    if (!displayedUser && currentUser) setDisplayedUser(currentUser);
  }, [displayedUser, currentUser, setDisplayedUser]);

  useEffect(() => {
    void presenter.loadUserInfo(authToken, currentUser, user);
  }, [authToken, currentUser, user, presenter, displayToast]);

  const switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    presenter.showCurrentUser(currentUser, location.pathname);
  };

  const updateFollowStatus = async (follow: boolean, event: React.MouseEvent): Promise<void> => {
    event.preventDefault();
    if (follow) await presenter.follow(authToken, user);
    else await presenter.unfollow(authToken, user);
  };

  if (!currentUser || !user || !authToken) return <></>;

  return (
    <div className="container">
      <div className="row">
        <div className="col-auto p-3">
          <img src={user.imageUrl} className="img-fluid" width="100" alt="Posting user" />
        </div>
        <div className="col p-3">
          {!user.equals(currentUser) && (
            <p id="returnToLoggedInUser">
              Return to <Link to={`./${currentUser.alias}`} onClick={switchToLoggedInUser}>logged in user</Link>
            </p>
          )}
          <h2><b>{user.name}</b></h2>
          <h3>{user.alias}</h3>
          <br />
          {followeeCount > -1 && followerCount > -1 && (
            <div>Followees: {followeeCount} Followers: {followerCount}</div>
          )}
        </div>
        {!user.equals(currentUser) && (
          <div className="form-group">
            <button
              id={isFollower ? "unFollowButton" : "followButton"}
              className={`btn btn-md ${isFollower ? "btn-secondary" : "btn-primary"} me-1`}
              type="button"
              style={{ width: "6em" }}
              disabled={isLoading}
              onClick={(event) => void updateFollowStatus(!isFollower, event)}
            >
              {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> : isFollower ? "Unfollow" : "Follow"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
