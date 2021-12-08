import React from 'react';
import {ThesaurusDebugger as HeadlessThesaurusDebugger} from '../../controller/thesaurus-debugger/headless-thesaurus-debugger';

export const ThesaurusDebugger: React.FunctionComponent<{
  controller: HeadlessThesaurusDebugger;
}> = ({controller}) => {
  controller.getThesaurus();
  return null;
};
