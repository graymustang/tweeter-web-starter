import { AuthToken } from "tweeter-shared";
import { AppNavbarView, AppNavbarPresenter } from "../../src/presenter/AppNavbarPresenter";
import { UserService } from "../../src/model.service/UserService";
import { instance, mock, spy, verify, when } from "@typestrong/ts-mockito";

describe('AppNavbarPresenter', () => {
    let mockAppNavbarPresenterView: AppNavbarView;
    //let mockUserService: UserService;
    let appNavbarPresenter: AppNavbarPresenter;
    let mockService: UserService;

    const authToken = new AuthToken('abc123', Date.now());

    beforeEach(() => {
        mockAppNavbarPresenterView = mock<AppNavbarView>();
        // mockUserService = mock<UserService>();
        const mockAppNavbarPresenterViewInstance = instance(mockAppNavbarPresenterView);

        const appNavbarPresenterSpy = spy(new AppNavbarPresenter(mockAppNavbarPresenterViewInstance));
        appNavbarPresenter = instance(appNavbarPresenterSpy)

        //(appNavbarPresenter as any).service = instance(mockUserService);
        //when(mockUserService.logout(authToken)).thenResolve();

        mockService = mock<UserService>()
        when(appNavbarPresenterSpy.service).thenReturn(instance(mockService))

    })

    it("tells the view to display a logging out message", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockAppNavbarPresenterView.displayInfoMessage("Logging Out...", 0)).once();
    })

    it('calls logout on the user service with the correct auth token', async () => {
        await appNavbarPresenter.logOut(authToken)
        verify(mockService.logout(authToken)).once()
    })

});
