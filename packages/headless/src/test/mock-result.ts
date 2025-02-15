import {Result} from '../api/search/search/result';
import {buildMockRaw} from './mock-raw';

/**
 * For internal use only.
 *
 * Returns a `Result` for testing purposes.
 * @param config  - A partial `Result` from which to build the target `Result`.
 * @returns The new `Result`.
 */
export function buildMockResult(config: Partial<Result> = {}): Result {
  return {
    title: '',
    uri: '',
    printableUri: '',
    clickUri: '',
    uniqueId: '',
    excerpt: '',
    firstSentences: '',
    summary: null,
    flags: '',
    hasHtmlVersion: false,
    score: 0,
    percentScore: 0,
    rankingInfo: null,
    isTopResult: false,
    isRecommendation: false,
    titleHighlights: [],
    firstSentencesHighlights: [],
    excerptHighlights: [],
    printableUriHighlights: [],
    summaryHighlights: [],
    absentTerms: [],
    raw: buildMockRaw(),
    ...config,
  };
}
