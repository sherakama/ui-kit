import {
  BreadcrumbManagerState,
  BreadcrumbManager,
  buildBreadcrumbManager,
  FacetManager,
  FacetManagerState,
  buildFacetManager,
} from '@coveo/headless';
import {Component, h, State, Element, VNode} from '@stencil/core';
import CloseIcon from '../../../images/close.svg';
import {
  FocusTarget,
  FocusTargetController,
} from '../../../utils/accessibility-utils';
import {getFieldValueCaption} from '../../../utils/field-utils';
import {
  InitializableComponent,
  BindStateToController,
  InitializeBindings,
} from '../../../utils/initialization-utils';
import {Button} from '../../common/button';
import {Hidden} from '../../common/hidden';
import {Bindings} from '../atomic-search-interface/atomic-search-interface';

interface Breadcrumb {
  facetId: string;
  label: string;
  formattedValue: string[];
  content?: VNode;
  deselect: () => void;
}

const SEPARATOR = ' / ';
const ELLIPSIS = '...';

/**
 * The `atomic-breadbox` component creates breadcrumbs that display a summary of the currently active facet values.
 *
 * @part breadcrumb-list - The list of breadcrumb buttons.
 * @part breadcrumb-button - A single breadcrumb button.
 * @part breadcrumb-label - The breadcrumb label, associated with the facet.
 * @part breadcrumb-value - The breadcrumb formatted value.
 * @part breadcrumb-clear - The button to clear individual filters.
 * @part show-more - The button to display all breadcrumbs.
 * @part show-less - The button to display less breadcrumbs.
 * @part label - The "Filters" label.
 * @part clear - The button to clear all filters.
 */
@Component({
  tag: 'atomic-breadbox',
  styleUrl: 'atomic-breadbox.pcss',
  shadow: true,
})
export class AtomicBreadbox implements InitializableComponent {
  @InitializeBindings() public bindings!: Bindings;
  private breadcrumbManager!: BreadcrumbManager;
  private resizeObserver?: ResizeObserver;
  private showMore!: HTMLButtonElement;
  private showLess!: HTMLButtonElement;
  private lastRemovedBreadcrumbIndex = 0;
  private numberOfBreadcrumbs = 0;
  private numberOfCollapsedBreadcrumbs = 0;
  private firstExpandedBreadcrumbIndex?: number;
  facetManager!: FacetManager;

  @Element() private host!: HTMLElement;

  @BindStateToController('breadcrumbManager')
  @State()
  private breadcrumbManagerState!: BreadcrumbManagerState;
  @BindStateToController('facetManager')
  @State()
  public facetManagerState!: FacetManagerState;
  @State() public error!: Error;
  @State() private isCollapsed = true;

  @FocusTarget()
  private breadcrumbRemovedFocus!: FocusTargetController;

  @FocusTarget()
  private breadcrumbShowMoreFocus!: FocusTargetController;

  @FocusTarget()
  private breadcrumbShowLessFocus!: FocusTargetController;

  public initialize() {
    this.breadcrumbManager = buildBreadcrumbManager(this.bindings.engine);
    this.facetManager = buildFacetManager(this.bindings.engine);

    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => this.adaptBreadcrumbs());
      this.resizeObserver.observe(this.host.parentElement!);
    }
  }

  public disconnectedCallback() {
    this.resizeObserver?.disconnect();
  }

  private get breadcrumbs() {
    return Array.from(
      this.host.shadowRoot!.querySelectorAll('li.breadcrumb')
    ) as HTMLElement[];
  }

  private hide(element: HTMLElement) {
    element.style.display = 'none';
  }

  private show(element: HTMLElement) {
    element.style.display = '';
  }

  private showAllBreadcrumbs() {
    this.breadcrumbs.forEach((breadcrumb) => this.show(breadcrumb));
  }

  private hideOverflowingBreadcrumbs() {
    let hiddenBreadcrumbs = 0;
    for (
      let i = this.breadcrumbs.length - 1;
      this.isOverflowing && i >= 0;
      i--
    ) {
      this.hide(this.breadcrumbs[i]);
      hiddenBreadcrumbs++;
    }
    this.updateShowMoreValue(hiddenBreadcrumbs);
  }

  private updateShowLessDisplay() {
    this.show(this.showLess);
    if (this.showLess.offsetTop === 0) {
      this.hide(this.showLess);
    }
  }

  private adaptBreadcrumbs() {
    if (!this.breadcrumbs.length) {
      return;
    }
    this.showAllBreadcrumbs();

    if (!this.isCollapsed) {
      this.updateShowLessDisplay();
      return;
    }

    this.updateShowMoreValue(this.breadcrumbs.length);
    this.hideOverflowingBreadcrumbs();
  }

  private get isOverflowing() {
    const listElement = this.host.shadowRoot!.querySelector('ul');
    if (!listElement) {
      return false;
    }
    return listElement.scrollWidth > listElement.clientWidth;
  }

  private limitPath(path: string[]) {
    if (path.length <= 3) {
      return path.join(SEPARATOR);
    }

    const ellipsedPath = [path[0], ELLIPSIS, ...path.slice(-2)];
    return ellipsedPath.join(SEPARATOR);
  }

  private renderBreadcrumb(breadcrumb: Breadcrumb, index: number) {
    const fullValue = Array.isArray(breadcrumb.formattedValue)
      ? breadcrumb.formattedValue.join(SEPARATOR)
      : breadcrumb.formattedValue;
    const value = Array.isArray(breadcrumb.formattedValue)
      ? this.limitPath(breadcrumb.formattedValue)
      : breadcrumb.formattedValue;
    const title = `${breadcrumb.label}: ${fullValue}`;

    return (
      <li class="breadcrumb" key={value}>
        <Button
          part="breadcrumb-button"
          style="outline-bg-neutral"
          class="py-2 px-3 flex items-center btn-pill group"
          title={title}
          ariaLabel={this.bindings.i18n.t('remove-filter-on', {
            value: title,
          })}
          onClick={() => {
            if (this.numberOfBreadcrumbs > 1) {
              this.breadcrumbRemovedFocus.focusAfterSearch();
            }
            this.lastRemovedBreadcrumbIndex = index;
            breadcrumb.deselect();
          }}
          ref={(ref) => {
            if (this.lastRemovedBreadcrumbIndex === index) {
              this.breadcrumbRemovedFocus.setTarget(ref);
            }
            if (this.firstExpandedBreadcrumbIndex === index) {
              this.breadcrumbShowMoreFocus.setTarget(ref);
            }
          }}
        >
          <span
            part="breadcrumb-label"
            class="max-w-snippet truncate text-neutral-dark mr-0.5 group-hover:text-primary group-focus-visible:text-primary"
          >
            {this.bindings.i18n.t('with-colon', {text: breadcrumb.label})}
          </span>
          <span
            part="breadcrumb-value"
            class={breadcrumb.content ? '' : 'max-w-snippet truncate'}
          >
            {breadcrumb.content ?? value}
          </span>
          <atomic-icon
            part="breadcrumb-clear"
            class="w-2.5 h-2.5 ml-2 mt-px"
            icon={CloseIcon}
            aria-hidden="true"
          ></atomic-icon>
        </Button>
      </li>
    );
  }

  private updateShowMoreValue(value: number) {
    this.numberOfCollapsedBreadcrumbs = value;
    if (value === 0) {
      this.hide(this.showMore);
      return;
    }

    this.show(this.showMore);
    this.showMore.textContent = `+ ${value.toLocaleString(
      this.bindings.i18n.language
    )}`;

    this.showMore.setAttribute(
      'aria-label',
      this.bindings.i18n.t('show-n-more-filters', {
        value,
      })
    );
  }

  private renderShowMore() {
    return (
      <li key="show-more">
        <Button
          ref={(ref) => {
            this.breadcrumbShowLessFocus.setTarget(ref!);
            this.showMore = ref!;
          }}
          part="show-more"
          style="outline-primary"
          class="p-2 btn-pill whitespace-nowrap"
          onClick={() => {
            this.firstExpandedBreadcrumbIndex =
              this.numberOfBreadcrumbs - this.numberOfCollapsedBreadcrumbs;
            this.breadcrumbShowMoreFocus.focusOnNextTarget();
            this.isCollapsed = false;
          }}
        ></Button>
      </li>
    );
  }

  private renderShowLess() {
    return (
      <li key="show-less">
        <Button
          ref={(ref) => (this.showLess = ref!)}
          part="show-less"
          style="outline-primary"
          text={this.bindings.i18n.t('show-less')}
          class="p-2 btn-pill"
          onClick={() => {
            this.breadcrumbShowLessFocus.focusOnNextTarget();
            this.isCollapsed = true;
          }}
        ></Button>
      </li>
    );
  }

  private renderClearAll() {
    const isFocusTarget =
      this.lastRemovedBreadcrumbIndex === this.numberOfBreadcrumbs;
    return (
      <li key="clear-all">
        <Button
          part="clear"
          style="text-primary"
          text={this.bindings.i18n.t('clear')}
          class="p-2 btn-pill"
          ariaLabel={this.bindings.i18n.t('clear-all-filters')}
          onClick={() => this.breadcrumbManager.deselectAll()}
          ref={
            isFocusTarget ? this.breadcrumbRemovedFocus.setTarget : undefined
          }
        ></Button>
      </li>
    );
  }

  private get facetBreadcrumbs(): Breadcrumb[] {
    return this.breadcrumbManagerState.facetBreadcrumbs
      .map(({facetId, field, values}) =>
        values.map((value) => ({value, facetId, field}))
      )
      .flat()
      .filter(({facetId}) => this.bindings.store.state.facets[facetId])
      .map(({value, facetId, field}) => ({
        facetId,
        label: this.bindings.store.state.facets[facetId]?.label(),
        deselect: value.deselect,
        formattedValue: [
          getFieldValueCaption(field, value.value.value, this.bindings.i18n),
        ],
      }));
  }

  private get categoryFacetBreadcrumbs(): Breadcrumb[] {
    return this.breadcrumbManagerState.categoryFacetBreadcrumbs.map(
      ({facetId, field, path, deselect}) => ({
        facetId,
        label: this.bindings.store.state.categoryFacets[facetId].label(),
        deselect: deselect,
        formattedValue: path.map((pathValue) =>
          getFieldValueCaption(field, pathValue.value, this.bindings.i18n)
        ),
      })
    );
  }

  private get numericFacetBreadcrumbs(): Breadcrumb[] {
    return this.breadcrumbManagerState.numericFacetBreadcrumbs
      .map(({facetId, field, values}) =>
        values.map((value) => ({value, facetId, field}))
      )
      .flat()
      .map(({value, facetId}) => ({
        facetId,
        label: this.bindings.store.state.numericFacets[facetId].label(),
        deselect: value.deselect,
        formattedValue: [
          this.bindings.store.state.numericFacets[facetId].format(value.value),
        ],
        content: this.bindings.store.state.numericFacets[facetId].content?.(
          value.value
        ),
      }));
  }

  private get dateFacetBreadcrumbs(): Breadcrumb[] {
    return this.breadcrumbManagerState.dateFacetBreadcrumbs
      .map(({facetId, field, values}) =>
        values.map((value) => ({value, facetId, field}))
      )
      .flat()
      .map(({value, facetId}) => ({
        facetId,
        label: this.bindings.store.state.dateFacets[facetId].label(),
        deselect: value.deselect,
        formattedValue: [
          this.bindings.store.state.dateFacets[facetId].format(value.value),
        ],
      }));
  }

  private get allBreadcrumbs(): Breadcrumb[] {
    return [
      ...this.facetBreadcrumbs,
      ...this.categoryFacetBreadcrumbs,
      ...this.numericFacetBreadcrumbs,
      ...this.dateFacetBreadcrumbs,
    ];
  }

  private renderBreadcrumbs(allBreadcrumbs: Breadcrumb[]) {
    const sortedBreadcrumbs = allBreadcrumbs.sort((a, b) => {
      const indexA = this.facetManagerState.facetIds.indexOf(a.facetId);
      const indexB = this.facetManagerState.facetIds.indexOf(b.facetId);
      return indexA - indexB;
    });
    this.numberOfBreadcrumbs = sortedBreadcrumbs.length;

    return [
      sortedBreadcrumbs.map((breadcrumb, i) =>
        this.renderBreadcrumb(breadcrumb, i)
      ),
      this.isCollapsed && this.renderShowMore(),
      !this.isCollapsed && this.renderShowLess(),
      this.renderClearAll(),
    ];
  }

  public render() {
    const allBreadcrumbs = this.allBreadcrumbs;

    if (!allBreadcrumbs.length) {
      return <Hidden></Hidden>;
    }

    return (
      <div class="text-on-background text-sm flex">
        <span part="label" class="font-bold py-[0.625rem] pl-0 pr-2">
          {this.bindings.i18n.t('with-colon', {
            text: this.bindings.i18n.t('filters'),
          })}
        </span>
        <div class="relative grow">
          <ul
            part="breadcrumb-list"
            class={`flex gap-1 ${
              this.isCollapsed ? 'flex-nowrap absolute w-full' : 'flex-wrap'
            }`}
          >
            {this.renderBreadcrumbs(allBreadcrumbs)}
          </ul>
        </div>
      </div>
    );
  }

  public componentDidRender() {
    this.adaptBreadcrumbs();
  }
}
