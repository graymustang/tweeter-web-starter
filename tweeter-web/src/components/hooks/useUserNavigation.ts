import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserNavigationPresenter } from "../../presenter/UserNavigationPresenter";
import useUserInfo from "./useUserInfo";
import useUserInfoActions from "./useUserInfoActions";
import useMessageActions from "./useMessageActions";
import { ToastType } from "../toaster/Toast";

const useUserNavigation = (featurePath: string) => {
  const navigate = useNavigate();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayToast } = useMessageActions();
  const { displayedUser: aliasFromRoute } = useParams();
  const presenterRef = useRef<UserNavigationPresenter | null>(null);

  if (!presenterRef.current) {
    presenterRef.current = new UserNavigationPresenter(
      {
        setDisplayedUser,
        navigate,
        displayErrorMessage: (message) => displayToast(ToastType.Error, message, 0),
      },
      featurePath,
    );
  }

  useEffect(() => {
    if (authToken && aliasFromRoute && aliasFromRoute !== displayedUser?.alias) {
      void presenterRef.current!.showUser(authToken, aliasFromRoute);
    }
  }, [authToken, aliasFromRoute, displayedUser?.alias]);

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();
    const alias = event.currentTarget.textContent?.trim();
    if (authToken && alias) {
      await presenterRef.current!.navigateToUser(authToken, alias, displayedUser);
    }
  };

  return { navigateToUser };
};

export default useUserNavigation;
