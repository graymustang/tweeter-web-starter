import { type StatusRequest, type TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { getDaoFactory } from "../../model/dao/DaoFactoryProvider";
import { withErrorMapping } from "../withErrorMapping";
const handle = async (request: StatusRequest): Promise<TweeterResponse> => {
  await new StatusService(getDaoFactory()).postStatus(request.token, request.userAlias, request.post, request.timestamp);
  return { success: true, message: null };
}
export const handler = withErrorMapping(handle);
