import { AuthToken } from "tweeter-shared";
import { FollowService } from "../components/model.service/FollowService";
import { UserService } from "../components/model.service/UserService";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";

export const PAGE_SIZE = 10;

export class FolloweePresenter extends UserItemPresenter {
    private service: FollowService;    

    public constructor(view: UserItemView) {
        super(view)
        this.service = new FollowService();
    }

    public async loadMoreItems(authToken: AuthToken, userAlias: string) {
        try {
            const [newItems, hasMore] = await this.service.loadMoreFollowees(
                authToken,
                userAlias,
                PAGE_SIZE,
                this.lastItem
            );

            this.setHasMoreItems = hasMore;
            this.setLastItem = newItems[newItems.length - 1];
            this.view.addItems(newItems);
        } catch (error) {
            this.view.displayToast(
                ToastType.Error,
                `Failed to load followees because of exception: ${error}`,
                0
            );
        }
    };
} 