import { useContext } from "react";
import { UserInfoContext } from "../userInfo/UserInfoContexts";

const useUserInfo = () => {
  return useContext(UserInfoContext);
};

export default useUserInfo;