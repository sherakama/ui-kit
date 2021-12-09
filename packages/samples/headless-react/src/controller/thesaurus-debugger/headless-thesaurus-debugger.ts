import {
  SearchEngine,
  SearchAppState,
  buildSearchBox,
  SearchBox,
  SearchBoxState,
} from '@coveo/headless';
import {getThesaurusPlan} from '../../features/thesaurus-debugger/thesaurus-debugger-actions';
import {thesaurusDebuggerReducer} from '../../features/thesaurus-debugger/thesaurus-debugger-slice';
import {ThesaurusDebuggerState} from '../../features/thesaurus-debugger/thesaurus-debugger-state';

export interface HeadlessThesaurusDebugger extends SearchBox {
  state: HeadlessThesaurusDebuggerState;
}

export interface HeadlessThesaurusDebuggerState extends SearchBoxState {
  thesaurus: string;
}

export function buildHeadlessThesaurusDebugger(
  engine: SearchEngine
): HeadlessThesaurusDebugger {
  if (!loadThesaurusManagerReducers(engine)) {
    throw new Error('Failed to load thesaurus debugger');
  }

  const {dispatch} = engine;
  const searchBox = buildSearchBox(engine);
  return {
    ...searchBox,
    updateText(value: string) {
      searchBox.updateText(value);
      dispatch(getThesaurusPlan(value));
    },
    get state() {
      return {
        ...searchBox.state,
        thesaurus: engine.state.thesaurusDebugger.processedQuery,
      };
    },
  };
}

function loadThesaurusManagerReducers(
  engine: SearchEngine
): engine is SearchEngine<
  SearchAppState & {thesaurusDebugger: ThesaurusDebuggerState}
> {
  engine.addReducers({thesaurusDebugger: thesaurusDebuggerReducer});
  return true;
}
