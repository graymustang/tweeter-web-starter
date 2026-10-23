import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import useUserInfoActions from "../../hooks/useUserInfoActions";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { ToastType } from "../../toaster/Toast";
import AuthenticationFields from "../AuthenticationFields";
import useMessageActions from "../../hooks/useMessageActions";
import { LoginPresenter } from "../../../presenter/LoginPresenter";

interface Props {
  originalUrl?: string;
  presenter?: LoginPresenter;
  // Make sure not to render a new presenter if we pass in a presenter (props.presenter)
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayToast } = useMessageActions();
  const [presenter] = useState(() => props.presenter ?? new LoginPresenter({
    setLoading: setIsLoading,
    displayErrorMessage: (message) => displayToast(ToastType.Error, message, 0),
    loginSucceeded: (user, authToken, remember) => {
      updateUserInfo(user, user, authToken, remember);
      navigate(props.originalUrl || `/feed/${user.alias}`);
    },
  }));

  const checkSubmitButtonStatus = (): boolean => {
    return !presenter.canSubmit(alias, password);
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" && !checkSubmitButtonStatus()) {
      void doLogin();
    }
  };

  const doLogin = async () => {
    await presenter.login(alias, password, rememberMe);
  };

  const inputFieldFactory = () => {
    return (
      <AuthenticationFields
        setAlias={setAlias}
        setPassword={setPassword}
        onEnter={loginOnEnter}
      />
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
