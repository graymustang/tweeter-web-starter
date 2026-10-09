import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { AuthToken, User } from "tweeter-shared";
import { ToastType } from "../toaster/Toast";
import UserItem from "../userItem/UserItem";
import useUserInfo from "../hooks/useUserInfo";
import useMessageActions from "../hooks/useMessageActions";
import useUserNavigation from "../hooks/useUserNavigation";
import { FolloweePresenter, FolloweeView } from "../../presenter/FolloweePresenter";
import { UserItemPresenter, UserItemView } from "../../presenter/UserItemPresenter";


interface Props {
    featurePath: string;
    presenterFactory: (listener: FolloweeView) => UserItemView
}

const UserItemScroller = (props: Props) => {
    const { displayToast } = useMessageActions();
    const { displayedUser, authToken } = useUserInfo();

    const listener: FolloweeView = {
        const addItems = (newItems: User[]) =>
            setItems((previousItems) => [...previousItems, ...newItems]),
        displayErrorMessage: displayErrorMessage
    }

    const presenter = props.presenterFactory(listener);

    useUserNavigation(props.featurePath);

    const [items, setItems] = useState<User[]>([]);
    useEffect(() => {
        reset();
        loadMoreItems(null);
    }, [displayedUser]);

    const reset = () => {
        presenter.reset();
        setItems([]);
        presenter.reset();
    };

     const loadMoreItems = async(lastItem: User | null) => {
        presenter.loadMoreItems(authToken, displayUser!.alias)
};

const getUser = async (
    authToken: AuthToken,
    alias: string
): Promise<User | null> => {
    return presenter.getUser(authToken, alias)
};

return (
    <div className="container px-0 overflow-visible vh-100">
        <InfiniteScroll
            className="pr-0 mr-0"
            dataLength={items.length}
            next={() => loadMoreItems(lastItem)}
            hasMore={hasMoreItems}
            loader={<h4>Loading...</h4>}
        >
            {items.map((item, index) => (
                <div
                    key={index}
                    className="row mb-3 mx-0 px-0 border rounded bg-white"
                >
                    <UserItem
                        user={item}
                        featurePath={props.featurePath}
                    />
                </div>
            ))}
        </InfiniteScroll>
    </div>
);
};

export default UserItemScroller;