import { useContext } from "react";
import { UserInfoActionsContext } from "../userInfo/UserInfoContexts";

const useUserInfoActions = () => {
  return useContext(UserInfoActionsContext);
};

export default useUserInfoActions;