import { UserDto } from "../../dto/UserDto";

export interface PagedUserItemResponse {
    readonly success: boolean,
    readonly message: string | null,
    readonly items: UserDto | null,
    readonly hasMore: boolean,
}