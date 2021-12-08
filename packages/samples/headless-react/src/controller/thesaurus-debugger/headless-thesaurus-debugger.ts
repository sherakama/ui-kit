import {buildController, Controller, SearchEngine} from '@coveo/headless';
import {getThesaurusPlan} from '../../features/thesaurus-debugger/thesaurus-debugger-actions';
import {thesaurusDebuggerReducer} from '../../features/thesaurus-debugger/thesaurus-debugger-slice';
import {ThesaurusDebuggerState} from '../../features/thesaurus-debugger/thesaurus-debugger-state';

export interface ThesaurusDebugger extends Controller {
  getThesaurus(): void;
}

export function buildThesaurusDebugger(
  engine: SearchEngine
): ThesaurusDebugger {
  if (!loadThesaurusManagerReducers(engine)) {
    throw new Error('Failed to load thesaurus debugger');
  }
  const controller = buildController(engine);
  const {dispatch} = engine;
  return {
    ...controller,
    getThesaurus: function () {
      dispatch(getThesaurusPlan());
    },
  };
}

function loadThesaurusManagerReducers(
  engine: SearchEngine
): engine is SearchEngine<{thesaurusDebugger: ThesaurusDebuggerState}> {
  engine.addReducers({thesaurusDebugger: thesaurusDebuggerReducer});
  return true;
}
