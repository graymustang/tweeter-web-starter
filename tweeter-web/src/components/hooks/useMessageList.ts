import { useContext } from "react";
import { ToastListContext } from "../toaster/ToastContexts";

const useMessageList = () => {
  return useContext(ToastListContext);
};

export default useMessageList;