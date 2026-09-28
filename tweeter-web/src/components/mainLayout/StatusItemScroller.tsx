import { useEffect, useState } from "react";
import { AuthToken, Status } from "tweeter-shared";
import InfiniteScroll from "react-infinite-scroll-component";
import { ToastType } from "../toaster/Toast";
import StatusItem from "../statusItem/statusItem";
import useUserInfo from "../hooks/useUserInfo";
import useMessageActions from "../hooks/useMessageActions";
import useUserNavigation from "../hooks/useUserNavigation";

export const PAGE_SIZE = 10;

interface Props {
    featurePath: string;
    itemDescription: string;
    loadMoreItems: (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ) => Promise<[Status[], boolean]>;
}

const StatusItemScroller = (props: Props) => {
    const { displayToast } = useMessageActions();
    const { displayedUser, authToken } = useUserInfo();
    const { navigateToUser } = useUserNavigation(props.featurePath);

    const [items, setItems] = useState<Status[]>([]);
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [lastItem, setLastItem] = useState<Status | null>(null);

    const addItems = (newItems: Status[]) =>
        setItems((previousItems) => [...previousItems, ...newItems]);

    useEffect(() => {
        reset();
        loadMoreItems(null);
    }, [displayedUser]);

    const reset = () => {
        setItems([]);
        setLastItem(null);
        setHasMoreItems(true);
    };

    const loadMoreItems = async (lastItem: Status | null) => {
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
                        <StatusItem
                            status={item}
                            featurePath={props.featurePath}
                            navigateToUser={navigateToUser}
                        />
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    );
};

export default StatusItemScroller;