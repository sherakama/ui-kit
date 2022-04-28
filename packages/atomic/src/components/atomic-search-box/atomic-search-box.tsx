import SearchIcon from 'coveo-styleguide/resources/icons/svg/search.svg';
import ClearIcon from 'coveo-styleguide/resources/icons/svg/clear.svg';
import {
  Component,
  h,
  State,
  Prop,
  Listen,
  Watch,
  Element,
} from '@stencil/core';
import {
  SearchBox,
  SearchBoxState,
  buildSearchBox,
  loadQuerySetActions,
  QuerySetActionCreators,
  StandaloneSearchBox,
  StandaloneSearchBoxState,
  buildStandaloneSearchBox,
  SearchEngine,
  buildSearchEngine,
  loadQueryActions,
  loadSearchActions,
  LogLevel,
  loadSearchAnalyticsActions,
  Result,
  buildResultList,
  EcommerceDefaultFieldsToInclude,
} from '@coveo/headless';
import {
  Bindings,
  BindStateToController,
  InitializeBindings,
  InitializeEvent,
} from '../../utils/initialization-utils';
import {Button} from '../common/button';
import {randomID} from '../../utils/utils';
import {isNullOrUndefined} from '@coveo/bueno';
import {
  SearchBoxSuggestionElement,
  SearchBoxSuggestions,
  SearchBoxSuggestionsBindings,
  SearchBoxSuggestionsEvent,
} from '../search-box-suggestions/suggestions-common';
import {AriaLiveRegion} from '../../utils/accessibility-utils';
import {SafeStorage, StorageItems} from '../../utils/local-storage-utils';

/**
 * The `atomic-search-box` component creates a search box with built-in support for suggestions.
 *
 * @part wrapper - The search box wrapper.
 * @part input - The search box input.
 * @part loading - The search box loading animation.
 * @part clear-button - The button to clear the search box of input.
 * @part submit-button - The search box submit button.
 * @part suggestions - A list of suggested query corrections.
 * @part suggestion - A suggested query correction.
 * @part active-suggestion - The currently active suggestion.
 */
@Component({
  tag: 'atomic-search-box',
  styleUrl: 'atomic-search-box.pcss',
  shadow: true,
})
export class AtomicSearchBox {
  @InitializeBindings() public bindings!: Bindings;
  private searchBox!: SearchBox | StandaloneSearchBox;
  private id!: string;
  private inputRef!: HTMLInputElement;
  private listRef!: HTMLElement;
  private querySetActions!: QuerySetActionCreators;
  private pendingSuggestionEvents: SearchBoxSuggestionsEvent[] = [];
  private suggestions: SearchBoxSuggestions[] = [];
  private hangingComponentsInitialization: InitializeEvent[] = [];
  @Prop({reflect: true}) public fieldsToInclude = '';

  /**
   * The search interface [query pipeline](https://docs.coveo.com/en/180/).
   */
  @Prop({reflect: true}) public pipeline?: string;

  /**
   * The search interface [search hub](https://docs.coveo.com/en/1342/).
   */
  @Prop({reflect: true}) public searchHub = 'default';

  /**
   * The [tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) identifier of the time zone to use to correctly interpret dates in the query expression, facets, and result items.
   * By default, the timezone will be [guessed](https://day.js.org/docs/en/timezone/guessing-user-timezone).
   *
   * @example
   * America/Montreal
   */
  @Prop({reflect: true}) public timezone?: string;

  /**
   * The search interface language.
   */
  @Prop({reflect: true}) public language = 'en';
  @BindStateToController('searchBox')
  @State()
  private searchBoxState!: SearchBoxState | StandaloneSearchBoxState;
  @State() public error!: Error;
  @State() private isExpanded = false;
  @State() private activeDescendant = '';
  @State() private suggestionElements: SearchBoxSuggestionElement[] = [];
  private engine?: SearchEngine;
  @Element() public host!: HTMLDivElement;

  @State()
  private instantResultsQuery = '';

  @State()
  private resultCache: Record<string, Result[]> = {};

  private resultTemplate!: DocumentFragment;
  /**
   * The amount of queries displayed when the user interacts with the search box.
   * By default, a mix of query suggestions and recent queries will be shown.
   * You can configure those settings using the following components as children:
   *  - atomic-search-box-query-suggestions
   *  - atomic-search-box-recent-queries
   */
  @Prop({reflect: true}) public numberOfQueries = 8;

  /**
   * Defining this option makes the search box standalone.
   *
   * This option defines the default URL the user should be redirected to, when a query is submitted.
   * If a query pipeline redirect is triggered, it will redirect to that URL instead
   * (see [query pipeline triggers](https://docs.coveo.com/en/1458)).
   */
  @Prop({reflect: true}) public redirectionUrl?: string;

  @Prop({reflect: true}) public maxInstantResults = 3;

  @AriaLiveRegion('search-box')
  protected ariaMessage!: string;

  @Listen('atomic/suggestionsBindings')
  public handleInitialization(event: InitializeEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (this.engine) {
      event.detail(this.bindings);
      return;
    }

    this.hangingComponentsInitialization.push(event);
  }

  public initialize() {
    this.id = randomID('atomic-search-box-');
    this.querySetActions = loadQuerySetActions(this.bindings.engine);

    const searchBoxOptions = {
      id: this.id,
      numberOfSuggestions: 0,
      highlightOptions: {
        notMatchDelimiters: {
          open: '<span class="font-bold">',
          close: '</span>',
        },
        correctionDelimiters: {
          open: '<span class="font-normal">',
          close: '</span>',
        },
      },
    };

    this.searchBox = this.redirectionUrl
      ? buildStandaloneSearchBox(this.bindings.engine, {
          options: {...searchBoxOptions, redirectionUrl: this.redirectionUrl},
        })
      : buildSearchBox(this.bindings.engine, {
          options: searchBoxOptions,
        });

    this.suggestions.push(
      ...this.pendingSuggestionEvents.map((event) =>
        event(this.suggestionBindings)
      )
    );
    this.pendingSuggestionEvents = [];
    this.initializeInstantResults();

    this.resultTemplate = this.host.querySelector(
      'template'
    )?.content!;
    if (!this.resultTemplate) {
      const content = document.createDocumentFragment();
      const linkEl = document.createElement('atomic-result-link');
      content.appendChild(linkEl);
      this.resultTemplate = content;
    }
  }

  public componentDidUpdate() {
    if (!('redirectTo' in this.searchBoxState)) {
      return;
    }

    const {redirectTo, value, analytics} = this.searchBoxState;

    if (redirectTo === '') {
      return;
    }
    const data = {value, analytics};
    const storage = new SafeStorage();
    storage.setJSON(StorageItems.STANDALONE_SEARCH_BOX_DATA, data);

    window.location.href = redirectTo;
  }

  @Listen('atomic/searchBoxSuggestion/register')
  public registerSuggestions(event: CustomEvent<SearchBoxSuggestionsEvent>) {
    event.preventDefault();
    event.stopPropagation();
    if (this.searchBox) {
      this.suggestions.push(event.detail(this.suggestionBindings));
      return;
    }
    this.pendingSuggestionEvents.push(event.detail);
  }

  @Watch('redirectionUrl')
  watchRedirectionUrl() {
    this.initialize();
  }

  @Watch('instantResultsQuery')
  watchInstantResultsQuery() {
    if (!this.resultCache[this.instantResultsQuery]) {
      this.searchInstantResults(this.instantResultsQuery);
    }
  }

  /**
   * Initializes the connection with the headless search engine using options for `accessToken` (required), `organizationId` (required), `renewAccessToken`, and `platformUrl`.
   */
  private initializeInstantResults() {
    this.initEngine();
    this.initComponents();
  }

  private initEngine() {
    const mainEngine = this.bindings.engine.state;
    const config = {
      configuration: {
        accessToken: mainEngine.configuration.accessToken,
        organizationId: mainEngine.configuration.organizationId,
        search: {
          searchHub: mainEngine.searchHub,
          pipeline: mainEngine.pipeline || undefined,
          locale: mainEngine.configuration.search.locale,
          timezone: mainEngine.configuration.search.timezone,
        },
      },
      loggerOptions: {
        level: 'silent' as LogLevel,
      },
    };
    try {
      this.engine = buildSearchEngine(config);
      buildResultList(this.engine, {options:{ fieldsToInclude: [...EcommerceDefaultFieldsToInclude, ...this.fieldsToInclude]}})
      this.engine.subscribe(() => {
        const searchStatusState = this.engine!.state;
        if (this.hasResultsCache(searchStatusState)) {
          this.setResultsCache(searchStatusState);
        }
      });
    } catch (error) {
      this.error = error as Error;
      throw error;
    }
  }

  private hasResultsCache(state: any) {
    return (
      state.search.queryExecuted &&
      !this.resultCache[state.search.queryExecuted]
    );
  }

  private setResultsCache(state: any) {
    this.resultCache = {
      ...this.resultCache,
      [state.search.queryExecuted]: state.search.results.slice(0, this.maxInstantResults),
    };
  }

  private initComponents() {
    this.hangingComponentsInitialization.forEach((event) =>
      event.detail(this.bindings)
    );
  }

  private get suggestionBindings(): SearchBoxSuggestionsBindings {
    return {
      ...this.bindings,
      id: this.id,
      isStandalone: !!this.redirectionUrl,
      searchBoxController: this.searchBox,
      numberOfQueries: this.numberOfQueries,
      clearSuggestions: () => this.clearSuggestions(),
      triggerSuggestions: () => this.triggerSuggestions(),
      getSuggestions: () => this.suggestions,
    };
  }

  private get popupId() {
    return `${this.id}-popup`;
  }

  private get hasInputValue() {
    return this.searchBoxState.value !== '';
  }

  private get hasSuggestions() {
    return !!this.suggestionElements.length;
  }

  private get hasActiveDescendant() {
    return this.activeDescendant !== '';
  }

  private updateActiveDescendant(activeDescendant = '') {
    this.activeDescendant = activeDescendant;
  }

  private get activeDescendantElement(): HTMLLIElement | null {
    if (!this.hasActiveDescendant) {
      return null;
    }

    return this.listRef.querySelector(`#${this.activeDescendant}`);
  }

  private get firstValue() {
    return this.listRef.firstElementChild;
  }

  private get lastValue() {
    return this.listRef.lastElementChild;
  }

  private get nextOrFirstValue() {
    if (!this.hasActiveDescendant) {
      return this.firstValue;
    }

    return this.activeDescendantElement?.nextElementSibling || this.firstValue;
  }

  private get previousOrLastValue() {
    if (!this.hasActiveDescendant) {
      return this.lastValue;
    }

    return (
      this.activeDescendantElement?.previousElementSibling || this.lastValue
    );
  }

  private scrollActiveDescendantIntoView() {
    this.activeDescendantElement?.scrollIntoView({
      block: 'nearest',
    });
  }

  private focusNextValue() {
    if (!this.hasSuggestions || !this.nextOrFirstValue) {
      return;
    }

    const query = this.nextOrFirstValue.getAttribute('data-query');
    !isNullOrUndefined(query) && this.updateQuery(query);
    this.updateActiveDescendant(this.nextOrFirstValue.id);
    this.scrollActiveDescendantIntoView();
  }

  private focusPreviousValue() {
    if (!this.hasSuggestions || !this.previousOrLastValue) {
      return;
    }

    const query = this.previousOrLastValue.getAttribute('data-query');
    !isNullOrUndefined(query) && this.updateQuery(query);
    this.updateActiveDescendant(this.previousOrLastValue.id);
    this.scrollActiveDescendantIntoView();
  }

  private updateAriaMessage() {
    this.ariaMessage = this.suggestionElements.length
      ? this.bindings.i18n.t('query-suggestions-available', {
          count: this.suggestionElements.filter(
            (element) => element.query !== undefined
          ).length,
        })
      : this.bindings.i18n.t('query-suggestions-unavailable');
  }

  private async triggerSuggestions() {
    await Promise.all(
      this.suggestions.map((suggestion) => suggestion.onInput())
    );
    const suggestionElements = this.suggestions
      .sort((a, b) => a.position - b.position)
      .map((suggestion) => suggestion.renderItems())
      .flat();

    const max =
      this.numberOfQueries +
      suggestionElements.filter((sug) => sug.query === undefined).length;

    if (suggestionElements.length) {
      const q = suggestionElements[1].query || '';
      if (!this.resultCache[q]) {
        this.searchInstantResults(q);
      }
      this.instantResultsQuery = q;
    }
    this.suggestionElements = suggestionElements.slice(0, max);
    this.updateAriaMessage();
  }

  private searchInstantResults(q: string) {
    const {updateQuery} = loadQueryActions(this.engine!);
    const {executeSearch} = loadSearchActions(this.engine!);
    const {logSearchFromLink} = loadSearchAnalyticsActions(this.engine!);

    this.engine!.dispatch(updateQuery({q}));
    this.engine!.dispatch(executeSearch(logSearchFromLink()));
  }

  private onInput(value: string) {
    this.isExpanded = true;
    this.searchBox.updateText(value);
    this.updateActiveDescendant();
    this.triggerSuggestions();
  }

  private onFocus() {
    this.isExpanded = true;
    this.triggerSuggestions();
  }

  private clearSuggestions() {
    // TODO:
    // this.isExpanded = false;
    this.updateActiveDescendant();
    // this.clearSuggestionElements();
  }

  private onSubmit() {
    if (this.activeDescendantElement) {
      this.activeDescendantElement.click();
      this.updateActiveDescendant();
      return;
    }

    this.searchBox.submit();
    this.updateActiveDescendant();
    this.clearSuggestions();
  }

  private updateQuery(query: string) {
    this.bindings.engine.dispatch(
      this.querySetActions.updateQuerySetQuery({
        id: this.id,
        query,
      })
    );
  }

  private onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'Enter':
        this.onSubmit();
        break;
      case 'Escape':
        this.clearSuggestions();
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.focusNextValue();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.focusPreviousValue();
        break;
    }
  }

  private renderInput() {
    return (
      <input
        part="input"
        ref={(el) => (this.inputRef = el as HTMLInputElement)}
        role="combobox"
        aria-autocomplete="both"
        aria-haspopup="true"
        aria-owns={this.popupId}
        aria-expanded={`${this.isExpanded}`}
        aria-activedescendant={this.activeDescendant}
        autocomplete="off"
        autocapitalize="off"
        autocorrect="off"
        placeholder={this.bindings.i18n.t('search')}
        aria-label={this.bindings.i18n.t('search-box')}
        type="text"
        class="h-full outline-none bg-transparent grow px-4 py-3.5 text-neutral-dark placeholder-neutral-dark text-lg"
        value={this.searchBoxState.value}
        onFocus={() => this.onFocus()}
        onBlur={() => this.clearSuggestions()}
        onInput={(e) => this.onInput((e.target as HTMLInputElement).value)}
        onKeyDown={(e) => this.onKeyDown(e)}
      />
    );
  }

  private renderClearButton() {
    return (
      <Button
        style="text-transparent"
        part="clear-button"
        class="w-8 h-8 mr-1.5 text-neutral-dark"
        onClick={() => {
          this.searchBox.clear();
          this.clearSuggestionElements();
          this.inputRef.focus();
        }}
        ariaLabel={this.bindings.i18n.t('clear')}
      >
        <atomic-icon icon={ClearIcon} class="w-3 h-3"></atomic-icon>
      </Button>
    );
  }

  private renderInputContainer() {
    const isLoading = this.searchBoxState.isLoading;
    return (
      <div class="grow flex items-center">
        {this.renderInput()}
        {isLoading && (
          <span
            part="loading"
            class="loading w-5 h-5 rounded-full bg-gradient-to-r animate-spin mr-3 grid place-items-center"
          ></span>
        )}
        {!isLoading && this.hasInputValue && this.renderClearButton()}
      </div>
    );
  }

  private clearSuggestionElements() {
    this.suggestionElements = [];
    this.ariaMessage = '';
  }

  private renderSuggestion(
    suggestion: SearchBoxSuggestionElement,
    index: number
  ) {
    const id = `${this.id}-suggestion-${index}`;
    const isSelected = id === this.activeDescendant;
    return (
      <li
        id={id}
        role="option"
        aria-selected={`${isSelected}`}
        key={suggestion.key}
        data-query={suggestion.query}
        part={isSelected ? 'active-suggestion suggestion' : 'suggestion'}
        class={`flex px-4 h-10 items-center text-neutral-dark hover:bg-neutral-light cursor-pointer first:rounded-t-md last:rounded-b-md ${
          isSelected ? 'bg-neutral-light' : ''
        }`}
        onMouseDown={(e) => e.preventDefault()}
        onMouseOver={() => {
          console.log('suggestion.query:', suggestion.query)
          if (suggestion.query) {
            this.instantResultsQuery = suggestion.query || '';
          }
        }}
        onClick={() => suggestion.onSelect()}
      >
        {suggestion.content}
      </li>
    );
  }

  private renderSuggestions() {
    return (
      <ul
        id={this.popupId}
        role="listbox"
        part="suggestions"
        aria-label={this.bindings.i18n.t('query-suggestion-list')}
        ref={(el) => (this.listRef = el!)}
      >
        {this.suggestionElements.map((suggestion, index) =>
          this.renderSuggestion(suggestion, index)
        )}
      </ul>
    );
  }

  private renderSubmitButton() {
    return (
      <Button
        style="primary"
        class="w-12 h-auto rounded-r-md rounded-l-none -my-px -mr-px"
        part="submit-button"
        ariaLabel={this.bindings.i18n.t('search')}
        onClick={() => {
          this.searchBox.submit();
          this.clearSuggestionElements();
        }}
      >
        <atomic-icon icon={SearchIcon} class="w-4 h-4"></atomic-icon>
      </Button>
    );
  }

  public render() {
    const instantResults = this.resultCache[this.instantResultsQuery] || [];
    const showSuggestions = this.hasSuggestions && this.isExpanded;

    return [
      <div
        part="wrapper"
        class={
          'relative flex bg-background h-full w-full border border-neutral rounded-md focus-within:border-primary focus-within:ring focus-within:ring-ring-primary'
        }
      >
        {this.renderInputContainer()}
        <div
          class={`w-full z-10 absolute left-0 top-full rounded-md bg-background border border-neutral ${
            showSuggestions ? '' : 'hidden'
          } ${instantResults.length ? 'with-results' : ''}`}
          part="suggestions-wrapper"
        >
          {this.renderSuggestions()}
          {showSuggestions && !!instantResults.length && (
            <div part="results" class="instant-results" style={{gridTemplateColumns: `repeat(${this.maxInstantResults}, 1fr)`}}>
              {instantResults.map((result) => (
                <atomic-result
                  content={this.resultTemplate}
                  engine={this.engine!}
                  result={result}
                  key={result.uniqueId}
                ></atomic-result>
              ))}
            </div>
          )}
        </div>
        {this.renderSubmitButton()}
      </div>,
      !this.suggestions.length && (
        <slot>
          <atomic-search-box-recent-queries></atomic-search-box-recent-queries>
          <atomic-search-box-query-suggestions></atomic-search-box-query-suggestions>
        </slot>
      ),
    ];
  }
}
