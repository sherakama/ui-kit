import React, {useEffect, useState} from 'react';
import {HeadlessThesaurusDebugger} from '../../controller/thesaurus-debugger/headless-thesaurus-debugger';
import {SearchBox} from '../search-box/search-box.fn';

export const ThesaurusDebugger: React.FunctionComponent<{
  controller: HeadlessThesaurusDebugger;
}> = ({controller}) => {
  const [state, setState] = useState(controller.state);
  useEffect(() => {
    controller.subscribe(() => setState(controller.state));
  }, []);
  return (
    <>
      <SearchBox controller={controller} />
      <textarea value={state.thesaurus}></textarea>
    </>
  );
};
