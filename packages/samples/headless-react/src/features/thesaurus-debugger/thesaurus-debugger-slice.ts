import {createReducer} from '@reduxjs/toolkit';
import {getThesaurusPlan} from './thesaurus-debugger-actions';
import {getThesaurusDebuggerInitialState} from './thesaurus-debugger-state';

export const thesaurusDebuggerReducer = createReducer(
  getThesaurusDebuggerInitialState(),
  (builder) =>
    builder.addCase(getThesaurusPlan.fulfilled, (state) => {
      return state;
    })
);
