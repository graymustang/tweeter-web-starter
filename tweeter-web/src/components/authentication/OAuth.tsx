import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ToastType } from "../toaster/Toast";
import useMessageActions from "../hooks/useMessageActions";

interface Props {
  oAuthHeading: string;
}

const OAuth = (props: Props) => {
  const { displayToast } = useMessageActions();

  const displayInfoMessageWithDarkBackground = (message: string): void => {
    displayToast(
      ToastType.Info,
      message,
      3000,
      undefined,
      "text-white bg-primary"
    );
  };

  const createOAuthButton = (
    name: string,
    iconName: "google" | "facebook" | "twitter" | "linkedin" | "github"
  ) => {
    return (
      <button
        type="button"
        className="btn btn-link btn-floating mx-1"
        onClick={() =>
          displayInfoMessageWithDarkBackground(
            `${name} registration is not implemented.`
          )
        }
      >
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id={`${iconName}Tooltip`}>
              {name}
            </Tooltip>
          }
        >
          <FontAwesomeIcon icon={["fab", iconName]} />
        </OverlayTrigger>
      </button>
    );
  };

  return (
    <>
      <h1 className="h4 mb-3 fw-normal">Or</h1>
      <h1 className="h5 mb-3 fw-normal">{props.oAuthHeading}</h1>

      <div className="text-center mb-3">
        {createOAuthButton("Google", "google")}
        {createOAuthButton("Facebook", "facebook")}
        {createOAuthButton("Twitter", "twitter")}
        {createOAuthButton("LinkedIn", "linkedin")}
        {createOAuthButton("GitHub", "github")}
      </div>
    </>
  );
};

export default OAuth;