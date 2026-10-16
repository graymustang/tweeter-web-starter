import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import PagedItemScroller from "./components/mainLayout/PagedItemScroller";
import useUserInfo from "./components/hooks/useUserInfo";
import { User, Status } from "tweeter-shared";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import UserItem from "./components/userItem/UserItem";
import StatusItem from "./components/statusItem/statusItem";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
        <Route
          path="feed/:displayedUser"
          element={
            <PagedItemScroller<Status>
              key="feed"
              featurePath="/feed"
              presenterFactory={(view) => new FeedPresenter(view)}
              itemComponentGenerator={(status, navigateToUser) => (
                <StatusItem status={status} featurePath="/feed" navigateToUser={navigateToUser} />
              )}
              itemKeyGenerator={(status, index) => `${status.timestamp}-${index}`}
            />
          }
        />
        <Route
          path="story/:displayedUser"
          element={
            <PagedItemScroller<Status>
              key="story"
              featurePath="/story"
              presenterFactory={(view) => new StoryPresenter(view)}
              itemComponentGenerator={(status, navigateToUser) => (
                <StatusItem status={status} featurePath="/story" navigateToUser={navigateToUser} />
              )}
              itemKeyGenerator={(status, index) => `${status.timestamp}-${index}`}
            />
          }
        />
        <Route
          path="followees/:displayedUser"
          element={
            <PagedItemScroller<User>
              key="followees"
              featurePath="/followees"
              presenterFactory={(view) => new FolloweePresenter(view)}
              itemComponentGenerator={(user, navigateToUser) => (
                <UserItem user={user} featurePath="/followees" navigateToUser={navigateToUser} />
              )}
              itemKeyGenerator={(user, index) => `${user.alias}-${index}`}
            />
          }
        />
        <Route
          path="followers/:displayedUser"
          element={
            <PagedItemScroller<User>
              key="followers"
              featurePath="/followers"
              presenterFactory={(view) => new FollowerPresenter(view)}
              itemComponentGenerator={(user, navigateToUser) => (
                <UserItem user={user} featurePath="/followers" navigateToUser={navigateToUser} />
              )}
              itemKeyGenerator={(user, index) => `${user.alias}-${index}`}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
