import { AuthToken, Status, User } from 'tweeter-shared';
import { StatusService } from '../../src/model.service/StatusService';
import { anything, capture, instance, mock, spy, verify, when } from '@typestrong/ts-mockito';
import {PostStatusPresenter, PostStatusView } from '../../src/presenter/PostStatusPresenter';

describe('PostStatusPresenter', () => {
    let mockView: PostStatusView;
    let mockService: StatusService;
    let presenter: PostStatusPresenter;

    const statusText = 'tweeter status text'
    const timestamp = 123456789
    const authToken = new AuthToken('test-token', timestamp)
    const user = new User('Test', 'User', '@test', 'image-url')

    beforeEach(() => {
        jest.spyOn(Date, 'now').mockReturnValue(timestamp);

        mockView = mock<PostStatusView>();
        when(mockView.displayInfoMessage(anything())).thenReturn('messageId123');

        mockService = mock<StatusService>();
        const presenterSpy = spy(new PostStatusPresenter(instance(mockView)));
        when(presenterSpy.service).thenReturn(instance(mockService));
        presenter = instance(presenterSpy);

        when(mockService.postStatus(anything(), anything())).thenResolve();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('tells the view to display a posting status message', async () => {
        await presenter.postStatus(statusText, authToken, user);

        verify(mockView.displayInfoMessage('Posting status...')).once();
    });

    it('calls postStatus on the service with the correct status and auth token', async () => {
        await presenter.postStatus(statusText, authToken, user);

        const expectedStatus = new Status(statusText, user, timestamp);
        verify(mockService.postStatus(authToken, anything())).once();

        const [capturedAuthToken, capturedStatus] = capture(mockService.postStatus).last();
        expect(capturedAuthToken).toBe(authToken);
        expect(capturedStatus).toEqual(expectedStatus);
    });

    it('clears the info message and post, then displays success when posting is successful', async () => {
        await presenter.postStatus(statusText, authToken, user);

        verify(mockView.deleteMessage('messageId123')).once();
        verify(mockView.clearStatus()).once();
        verify(mockView.displaySuccessMessage('Status posted!')).once();
        verify(mockView.displayErrorMessage(anything())).never();
    });

    it('clears the info message and displays an error without clearing the post when posting is not successful', async () => {
        const error = new Error('An error occurred');
        when(mockService.postStatus(anything(), anything())).thenThrow(error);

        await presenter.postStatus(statusText, authToken, user);

        verify(mockView.deleteMessage('messageId123')).once();
        //preference: error and error occured can be a variable (string literal)
        verify(mockView.displayErrorMessage('Failed to post the status because of exception: Error: An error occurred',),).once();
        verify(mockView.clearStatus()).never();
        verify(mockView.displaySuccessMessage(anything())).never();
    });
});
