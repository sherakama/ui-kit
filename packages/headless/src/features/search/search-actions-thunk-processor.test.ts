import {Logger} from 'pino';
import {SearchAPIClient} from '../../api/search/search-api-client';
import {buildMockResult} from '../../test';
import {buildMockSearchRequest} from '../../test/mock-search-request';
import {buildMockSearchResponse} from '../../test/mock-search-response';
import {buildMockSearchState} from '../../test/mock-search-state';
import {getConfigurationInitialState} from '../configuration/configuration-state';
import {updateQuery} from '../query/query-actions';
import {logSearchboxSubmit} from '../query/query-analytics-actions';
import {ExecuteSearchThunkReturn} from './search-actions';
import {
  AsyncSearchThunkProcessor,
  AsyncThunkConfig,
} from './search-actions-thunk-processor';

describe('AsyncSearchThunkProcessor', () => {
  let config: AsyncThunkConfig;
  beforeEach(() => {
    const results = [buildMockResult()];
    config = {
      analyticsAction: logSearchboxSubmit(),
      dispatch: jest.fn(),
      extra: {
        analyticsClientMiddleware: jest.fn(),
        apiClient: {search: jest.fn()} as unknown as SearchAPIClient,
        logger: jest.fn() as unknown as Logger,
        validatePayload: jest.fn(),
        preprocessRequest: jest.fn(),
      },
      getState: jest.fn().mockReturnValue({
        configuration: getConfigurationInitialState(),
        search: buildMockSearchState({
          results,
          response: buildMockSearchResponse({results}),
        }),
      }),
      rejectWithValue: jest.fn(),
    };
  });

  it('process properly when there is no error, results are returned, and no modification applies', async () => {
    const processor = new AsyncSearchThunkProcessor<{}>(config);

    const searchResponse = buildMockSearchResponse({
      results: [buildMockResult()],
    });

    const fetched = {
      response: {
        success: searchResponse,
      },
      duration: 123,
      queryExecuted: 'foo',
      requestExecuted: buildMockSearchRequest(),
    };

    const processed = (await processor.process(
      fetched
    )) as ExecuteSearchThunkReturn;

    expect(processed.response).toMatchObject(searchResponse);
    expect(config.extra.apiClient.search).not.toHaveBeenCalled();
  });

  it('processes properly when there is an error returned by the API', async () => {
    const processor = new AsyncSearchThunkProcessor<{}>(config);
    const theError = {
      statusCode: 500,
      message: 'Something went wrong',
      type: 'error',
    };

    const fetched = {
      response: {
        error: theError,
      },
      duration: 123,
      queryExecuted: 'foo',
      requestExecuted: buildMockSearchRequest(),
    };

    (await processor.process(fetched)) as ExecuteSearchThunkReturn;

    expect(config.rejectWithValue).toHaveBeenCalledWith(theError);
    expect(config.extra.apiClient.search).not.toHaveBeenCalled();
  });

  it('process properly when there are no results returned and there is a did you mean correction', async () => {
    const processor = new AsyncSearchThunkProcessor<{}>(config);

    const originalResponseWithNoResultsAndCorrection = buildMockSearchResponse({
      results: [],
      queryCorrections: [
        {
          correctedQuery: 'bar',
          wordCorrections: [
            {correctedWord: 'foo', length: 3, offset: 0, originalWord: 'foo'},
          ],
        },
      ],
    });

    const responseAfterCorrection = buildMockSearchResponse({
      results: [buildMockResult()],
    });

    (config.extra.apiClient.search as jest.Mock).mockReturnValue(
      Promise.resolve({success: responseAfterCorrection})
    );

    const fetched = {
      response: {
        success: originalResponseWithNoResultsAndCorrection,
      },
      duration: 123,
      queryExecuted: 'foo',
      requestExecuted: buildMockSearchRequest(),
    };

    const processed = (await processor.process(
      fetched
    )) as ExecuteSearchThunkReturn;

    expect(config.dispatch).toHaveBeenCalledWith(updateQuery({q: 'bar'}));
    expect(config.extra.apiClient.search).toHaveBeenCalled();
    expect(processed.response).toMatchObject({
      ...responseAfterCorrection,
      queryCorrections:
        originalResponseWithNoResultsAndCorrection.queryCorrections,
    });
  });

  it('process properly when there is a query trigger', async () => {
    const processor = new AsyncSearchThunkProcessor<{}>(config);

    const originalResponseWithQueryTrigger = buildMockSearchResponse({
      results: [buildMockResult()],
      triggers: [{content: 'bar', type: 'query'}],
    });

    const responseAfterModification = buildMockSearchResponse({
      results: [buildMockResult()],
    });

    (config.extra.apiClient.search as jest.Mock).mockReturnValue(
      Promise.resolve({success: responseAfterModification})
    );

    const fetched = {
      response: {
        success: originalResponseWithQueryTrigger,
      },
      duration: 123,
      queryExecuted: 'foo',
      requestExecuted: buildMockSearchRequest(),
    };

    const processed = (await processor.process(
      fetched
    )) as ExecuteSearchThunkReturn;

    expect(config.dispatch).toHaveBeenCalledWith(config.analyticsAction);
    expect(config.extra.apiClient.search).toHaveBeenCalled();
    expect(processed.response).toMatchObject(responseAfterModification);
  });
});
