import {Result} from '@coveo/headless';
import {Component, h, Method, Prop, State, Watch} from '@stencil/core';
import dayjs from 'dayjs';
import {
  InitializableComponent,
  InitializeBindings,
} from '../../../../utils/initialization-utils';
import {Button} from '../../../common/button';
import {Bindings} from '../../atomic-search-interface/atomic-search-interface';
import {QuickviewSidebar} from '../atomic-quickview-sidebar/atomic-quickview-sidebar';
import {QuickviewIframe} from '../quickview-iframe/quickview-iframe';
import {buildQuickviewPreviewBar} from '../quickview-preview-bar/quickview-preview-bar';
import {
  getWordsHighlights,
  HIGHLIGHT_PREFIX,
  QuickviewWordHighlight,
} from '../quickview-word-highlight/quickview-word-highlight';

export interface HighlightKeywords {
  highlightNone: boolean;
  keywords: {
    [text: string]: {
      indexIdentifier: string;
      enabled: boolean;
    };
  };
}

/**
 * @internal
 */
@Component({
  tag: 'atomic-quickview-modal',
  styleUrl: 'atomic-quickview-modal.pcss',
  shadow: true,
})
export class AtomicQuickviewModal implements InitializableComponent {
  @InitializeBindings() public bindings!: Bindings;
  @State() public error!: Error;

  @State() private highlightKeywords: HighlightKeywords = {
    highlightNone: false,
    keywords: {},
  };
  @Watch('highlightKeywords')
  watchHighlightKeywords() {
    this.handleHighlightsScripts();
  }

  @State() private minimizeSidebar = false;
  @State() private words: Record<string, QuickviewWordHighlight> = {};
  private iframeRef?: HTMLIFrameElement;

  @Prop({mutable: true, reflect: false}) content?: string;
  @Prop({mutable: true, reflect: false}) result?: Result;
  @Prop() sandbox?: string;

  @Method()
  public async reset() {
    this.words = {};
    this.highlightKeywords = {
      highlightNone: false,
      keywords: {},
    };
    this.minimizeSidebar = false;
    this.iframeRef = undefined;
    this.content = undefined;
    this.result = undefined;
  }

  private renderHeader() {
    // TODO: Header should be slottable from result template definition
    return (
      <div slot="header" class="w-full flex justify-between">
        <div>{this.result?.title}</div>
        <div>{dayjs(this.result?.raw.date).format('D/M/YYYY')}</div>
      </div>
    );
  }

  private renderBody() {
    return (
      <div slot="body" class="grid grid-cols-[min-content_auto] h-full">
        <div class="h-full">
          <QuickviewSidebar
            words={this.words}
            i18n={this.bindings.i18n}
            highlightKeywords={this.highlightKeywords}
            onHighlightKeywords={(highlight) =>
              (this.highlightKeywords = highlight)
            }
            minimized={this.minimizeSidebar}
            onMinimize={(minimize) => (this.minimizeSidebar = minimize)}
          />
        </div>
        <div class="overflow-auto relative">
          <QuickviewIframe
            sandbox={this.sandbox}
            result={this.result}
            content={this.content}
            onSetIframeRef={async (ref) => {
              this.iframeRef = ref;
              this.words = getWordsHighlights(
                this.termsToHighlight,
                this.iframeRef
              );
              this.handleHighlightsScripts();
            }}
          />
          {buildQuickviewPreviewBar(
            this.words,
            this.highlightKeywords,
            this.iframeRef
          )}
        </div>
      </div>
    );
  }

  private renderFooter() {
    const quickviewsInfoFromResultList =
      this.bindings.store.get('resultList')?.quickviews;
    const currentQuickviewPosition = this.bindings.store.get(
      'currentQuickviewPosition'
    );

    const first =
      (quickviewsInfoFromResultList?.position[currentQuickviewPosition] || 0) +
      1;
    const total = quickviewsInfoFromResultList?.total;

    return (
      <div slot="footer" class="flex items-center gap-2">
        <Button
          class="p-2"
          style="square-neutral"
          onClick={() => this.bindings.store.previousQuickview()}
          text="Prev"
        ></Button>
        <p>
          {this.bindings.i18n.t('showing-results-of', {
            first,
            total,
          })}
        </p>
        <Button
          class="p-2"
          style="square-neutral"
          onClick={() => this.bindings.store.nextQuickview()}
          text="Next"
        ></Button>
      </div>
    );
  }

  private onClose() {
    this.content = undefined;
    this.result = undefined;
  }

  private get isOpen() {
    return !!this.content && !!this.result;
  }

  private get highlightScriptId() {
    return 'CoveoDisableHighlightStyle';
  }

  private enableHighlights() {
    this.removeDisableHighlightScript();
  }

  private enableHighlightsSpecificKeyword(identifier: string) {
    this.removeDisableHighlightScript(identifier);
  }

  private disableHighlights() {
    this.createDisableHighlightScript();
  }

  private disableHighlightsSpecificKeyword(identifier: string) {
    this.createDisableHighlightScript(identifier);
  }

  private removeDisableHighlightScript(identifier?: string) {
    const doc = this.iframeRef?.contentWindow?.document;
    if (!doc) {
      return;
    }
    doc
      .getElementById(
        `${this.highlightScriptId}${identifier ? `:${identifier}` : ''}`
      )
      ?.remove();
  }

  private createDisableHighlightScript(identifier?: string) {
    const doc = this.iframeRef?.contentWindow?.document;
    if (!doc) {
      return;
    }

    const head = doc.head;
    const scriptId = `${this.highlightScriptId}${
      identifier ? `:${identifier}` : ''
    }`;
    const style = doc.getElementById(scriptId) || doc.createElement('style');
    style.setAttribute('id', scriptId);
    head.appendChild(style);
    style.appendChild(
      doc.createTextNode(`[id^="${HIGHLIGHT_PREFIX}${
        identifier ? `:${identifier}` : ''
      }"] {
      background-color: inherit !important;
      color: inherit !important;
    }`)
    );
  }

  private get termsToHighlight() {
    return this.bindings.engine.state.search.response.termsToHighlight;
  }

  private handleHighlightsScripts() {
    if (!this.highlightKeywords.highlightNone) {
      this.enableHighlights();
    } else {
      this.disableHighlights();
    }
    Object.values(this.highlightKeywords.keywords).forEach((word) => {
      if (word.enabled) {
        this.enableHighlightsSpecificKeyword(word.indexIdentifier);
      } else {
        this.disableHighlightsSpecificKeyword(word.indexIdentifier);
      }
    });
  }

  public render() {
    return (
      <atomic-modal
        class={'atomic-quickview-modal'}
        isOpen={this.isOpen}
        close={() => this.onClose()}
      >
        {this.renderHeader()}
        {this.renderBody()}
        {this.renderFooter()}
      </atomic-modal>
    );
  }
}
