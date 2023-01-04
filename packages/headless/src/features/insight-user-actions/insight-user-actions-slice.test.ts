import {
  InsightUserActionsResponse,
  UserActionType,
} from '../../api/service/insight/user-actions/user-actions-response';
import {fetcUserActions} from './insight-user-actions-actions';
import {insightUserActionsReducer} from './insight-user-actions-slice';
import {getInsightUserActionsInitialState} from './insight-user-actions-state';

describe('insight user actions slice', () => {
  const requestId = 'some-request-id';
  const errorResponse = {
    message: 'something bad happened',
    statusCode: 400,
    type: 'badluck',
  };

  it('should have an initial state', () => {
    expect(insightUserActionsReducer(undefined, {type: 'foo'})).toEqual(
      getInsightUserActionsInitialState()
    );
  });

  it('should set #loading to #true when fetching the interface', () => {
    const modifiedState = insightUserActionsReducer(
      getInsightUserActionsInitialState(),
      fetcUserActions.pending(requestId)
    );

    expect(modifiedState.loading).toBe(true);
  });

  it('should clear the #error when fetching the interface', () => {
    const errorState = {
      ...getInsightUserActionsInitialState(),
      error: errorResponse,
    };

    const modifiedState = insightUserActionsReducer(
      errorState,
      fetcUserActions.pending(requestId)
    );

    expect(modifiedState.error).toBeUndefined();
  });

  describe('when fetching interface fails', () => {
    const failedAction = fetcUserActions.rejected(
      null,
      requestId,
      null as unknown as void,
      errorResponse
    );

    it('should set #loading to #false', () => {
      const modifiedState = insightUserActionsReducer(
        getInsightUserActionsInitialState(),
        failedAction
      );

      expect(modifiedState.loading).toBe(false);
    });

    it('should set #error', () => {
      const modifiedState = insightUserActionsReducer(
        getInsightUserActionsInitialState(),
        failedAction
      );

      expect(modifiedState.error).toStrictEqual(errorResponse);
    });

    it('should set #timeline to #undefined', () => {
      const modifiedState = insightUserActionsReducer(
        getInsightUserActionsInitialState(),
        failedAction
      );

      expect(modifiedState.timeline.sessions).toHaveLength(0);
    });
  });

  describe('when fetching the user actions succeeds', () => {
    const response: InsightUserActionsResponse = {
      timeline: {
        sessions: [
          {
            start: '2023-01-04T20:05:13.741Z',
            end: '2023-01-04T21:00:42.741Z',
            actions: [
              {
                actionType: UserActionType.CLICK,
                timestamp: '2022-12-04T20:05:13.741Z',
                eventData: {},
                cause: 'resultClick',
                searchHub: 'someSearchHub',
                document: {
                  title: 'How to do that thing I need to do',
                  clickUri: 'https://www.insightfulwebsite.com/how-to',
                },
              },
            ],
          },
        ],
      },
    };
    const fetchUserActionsResponse = {
      response: response,
    };

    it('should set #loading to #false', () => {
      const modifiedState = insightUserActionsReducer(
        getInsightUserActionsInitialState(),
        fetcUserActions.fulfilled(fetchUserActionsResponse, requestId)
      );

      expect(modifiedState.loading).toBe(false);
    });

    it('should update the #timeline when user actions are returned', () => {
      const modifiedState = insightUserActionsReducer(
        getInsightUserActionsInitialState(),
        fetcUserActions.fulfilled(fetchUserActionsResponse, requestId)
      );

      const {timeline} = fetchUserActionsResponse.response;

      expect(modifiedState.timeline).toStrictEqual(timeline);
    });

    it('should set #error to #undefined', () => {
      const modifiedState = insightUserActionsReducer(
        getInsightUserActionsInitialState(),
        fetcUserActions.fulfilled(fetchUserActionsResponse, requestId)
      );

      expect(modifiedState.error).toBeUndefined();
    });
  });
});
