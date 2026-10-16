import { useState } from "react";
import { Link } from "react-router-dom";
import { User } from "tweeter-shared";

interface Props {
  user: User;
  featurePath: string;
  navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

const UserItem = (props: Props) => {
  const data = props.user as unknown as {
    firstName?: string;
    lastName?: string;
    alias?: string;
    imageUrl?: string;
    _firstName?: string;
    _lastName?: string;
    _alias?: string;
    _imageUrl?: string;
  };
  const firstName = data.firstName ?? data._firstName ?? "";
  const lastName = data.lastName ?? data._lastName ?? "";
  const alias = data.alias ?? data._alias ?? "";
  const imageUrl = data.imageUrl ?? data._imageUrl ?? "";
  const [imageFailed, setImageFailed] = useState(false);
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <div className="col-auto p-3">
            {imageUrl && !imageFailed ? (
              <img
                src={imageUrl}
                className="img-fluid"
                width="80"
                alt={`${fullName} profile`}
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div
                className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                style={{ width: 80, height: 80 }}
                role="img"
                aria-label={`${fullName} profile`}
              >
                {initials}
              </div>
            )}
          </div>
          <div className="col">
            <h2>
              <b>
                {firstName} {lastName}
              </b>{" "}
              -{" "}
              <Link
                to={`${props.featurePath}/${alias}`}
                onClick={props.navigateToUser}
              >
                {alias}
              </Link>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
