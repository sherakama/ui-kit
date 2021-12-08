export interface ThesaurusDebuggerState {
  processedQuery: string;
}

export const getThesaurusDebuggerInitialState: () => ThesaurusDebuggerState =
  () => ({processedQuery: ''});
