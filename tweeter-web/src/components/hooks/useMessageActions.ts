import { useContext } from "react";
import { ToastActionsContext } from "../toaster/ToastContexts";

const useMessageActions = () => {
  return useContext(ToastActionsContext);
};

export default useMessageActions;