import { PagedUserItemRequest } from 'tweeter-shared';

export const handler = async (request: PagedUserItemRequest): Prmoise<PagedUserItemResponse> => {
    const followService = new FollowService();
}
