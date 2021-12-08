import {
  buildSearchEngine,
  getSampleSearchEngineConfiguration,
  SearchEngine,
} from '@coveo/headless';
import {Component} from 'react';
import {ThesaurusDebugger} from '../components/thesaurus-debugger/thesaurus-debugger.fn';
import {
  buildThesaurusDebugger,
  ThesaurusDebugger as HeadlessThesaurusDebugger,
} from '../controller/thesaurus-debugger/headless-thesaurus-debugger';

export class ThesaurusDebuggingPage extends Component {
  private engine: SearchEngine;
  private thesaurusDebugger: HeadlessThesaurusDebugger;
  constructor(props: {}) {
    super(props);
    this.engine = buildSearchEngine({
      configuration: getSampleSearchEngineConfiguration(),
    });
    this.thesaurusDebugger = buildThesaurusDebugger(this.engine);
  }
  render() {
    return <ThesaurusDebugger controller={this.thesaurusDebugger} />;
  }
}
