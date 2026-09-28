import { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { AuthToken, FakeData, User } from "tweeter-shared";
import { useParams } from "react-router-dom";
import {
    UserInfoActionsContext,
    UserInfoContext,
} from "../userInfo/UserInfoContexts";
import { ToastActionsContext } from "../toaster/ToastContexts";
import { ToastType } from "../toaster/Toast";
import UserItem from "../userItem/UserItem";

export const PAGE_SIZE = 10;

interface Props {
    featurePath: string;
    loadMoreItems: (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ) => Promise<[User[], boolean]>;
    itemDescription: string;
}

const UserItemScroller = (props: Props) => {
    const { displayToast } = useContext(ToastActionsContext);
    const [items, setItems] = useState<User[]>([]);
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [lastItem, setLastItem] = useState<User | null>(null);

    const { displayedUser, authToken } = useContext(UserInfoContext);
    const { setDisplayedUser } = useContext(UserInfoActionsContext);
    const { displayedUser: displayedUserAliasParam } = useParams();

    const addItems = (newItems: User[]) =>
        setItems((previousItems) => [...previousItems, ...newItems]);

    const getUser = async (
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> => {
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

    useEffect(() => {
        reset();
        loadMoreItems(null);
    }, [displayedUser]);

    const reset = () => {
        setItems([]);
        setLastItem(null);
        setHasMoreItems(true);
    };

    const loadMoreItems = async (lastItem: User | null) => {
        try {
            const [newItems, hasMore] = await props.loadMoreItems(
                authToken!,
                displayedUser!.alias,
                PAGE_SIZE,
                lastItem
            );

            setHasMoreItems(hasMore);
            setLastItem(newItems[newItems.length - 1]);
            addItems(newItems);
        } catch (error) {
            displayToast(
                ToastType.Error,
                `Failed to load ${props.itemDescription} because of exception: ${error}`,
                0
            );
        }
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
                        <UserItem user={item} featurePath={props.featurePath} />
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    );
};

export default UserItemScroller;