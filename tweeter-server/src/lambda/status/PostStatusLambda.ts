import { FakeData, Status, type StatusRequest, type TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (request: StatusRequest): Promise<TweeterResponse> => {
  const user = FakeData.instance.findUserByAlias(request.userAlias);
  if (!user) throw new Error("A valid user is needed to post a status");
  await new StatusService().postStatus(request.token, new Status(request.post, user, request.timestamp));
  return { success: true, message: null };
};
