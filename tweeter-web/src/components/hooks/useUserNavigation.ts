import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthToken, FakeData, User } from "tweeter-shared";
import useUserInfo from "./useUserInfo";
import useUserInfoActions from "./useUserInfoActions";
import useMessageActions from "./useMessageActions";
import { ToastType } from "../toaster/Toast";

const useUserNavigation = (featurePath: string) => {
  const navigate = useNavigate();

  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayToast } = useMessageActions();

  const { displayedUser: displayedUserAliasParam } = useParams();

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };

  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam != displayedUser!.alias
    ) {
      getUser(authToken, displayedUserAliasParam).then((toUser) => {
        if (toUser) {
          setDisplayedUser(toUser);
        }
      });
    }
  }, [displayedUserAliasParam]);

  const navigateToUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();

    try {
      const alias = extractAlias(event.target.toString());

      const toUser = await getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          setDisplayedUser(toUser);
          navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    } catch (error) {
      displayToast(
        ToastType.Error,
        `Failed to get user because of exception: ${error}`,
        0
      );
    }
  };

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  return {
    navigateToUser,
  };
};

export default useUserNavigation;