/* eslint-disable @lwc/lwc/no-async-operation */
// @ts-ignore
import {LightningElement, track} from 'lwc';

/**
 * @typedef {Object} FacetDefinition
 * @property {String} id - The unique id of the facet.
 * @property {String} field - The field whose values you want to display in the facet.
 * @property {String} label - The non-localized label for the facet. This label is displayed in the facet header.
 * @property {Number} numberOfValues - The non-localized label for the facet. This label is displayed in the facet header.
 */

/** @typedef {import("coveo").FacetOptions} FacetOptions */

export default class ExampleConfigAgentPanel extends LightningElement {
  /**
   * @typedef {Object} AgentPanelConfig
   * @property {Array<Object>} templates
   * @property {Object} analytics
   * @property {Array<FacetOptions>} facets
   */
  @track _config = {
    templates: [
      {
        name: 'Case Template',
        config: {
          showLabel: false,
          hasThumbnail: false,
        },
        condition: {
          fieldName: 'objecttype',
          fieldValues: ['Case'],
        },
        fieldsToInclude: ['sfstatus', 'sfcasestatus', 'sfcasenumber'],
      },
      {
        name: 'YouTube Template',
        config: {
          showLabel: true,
          hasThumbnail: true,
          hasYTDuration: true,
          metadata: [
            {
              field: 'author',
              label: 'Author',
            },
            {
              field: 'sourcetype',
              label: 'Source',
            },
          ],
        },
        condition: {
          fieldName: 'filetype',
          fieldValues: ['YouTubeVideo'],
        },
        fieldsToInclude: ['ytvideoid', 'ytvideoduration'],
      },
    ],
    analytics: {
      originLevel1: 'SFINT-4300-POC',
    },
    facets: [
      {
        field: 'objecttype',
        label: 'Type',
      },
      {
        field: 'filetype',
        label: 'File Type',
        valueAs: 'link',
      },
      {
        field: 'ytlikecount',
        label: 'Youtube Likes',
        type: 'numeric',
        withInput: 'integer',
      },
      {
        field: 'date',
        label: 'Date',
        type: 'timeframe',
        withDatePicker: true,
        timeframes: [
          {
            unit: 'week',
          },
          {
            unit: 'month',
          },
          {
            unit: 'month',
            amount: 6,
          },
          {
            unit: 'year',
          },
        ],
      },
      {
        field: 'geographicalhierarchy',
        label: 'Country',
        type: 'category',
      },
    ],
    tabs: [
      {
        label: 'All',
        default: true,
      },
      {
        label: 'YouTube',
        expression: '@filetype=="YouTubeVideo"',
      },
      {
        label: 'Cases',
        expression: '@objecttype=="Case"',
      },
      {
        label: 'Community',
        expression: '@objecttype=="Message"',
      },
      {
        label: 'Files',
        expression: '@boxdocumenttype==File OR @spcontenttype==Document',
      },
    ],
    summary: {
      include: false,
    },
    queryError: {
      include: false,
    },
    breadcrumb: {
      include: false,
    },
    didYouMean: {
      include: true,
    },
    noResults: {
      include: true,
    },
    pager: {
      include: false,
    },
    resultsPerPage: {
      include: false,
      choicesDisplayed: '10,25,50,100',
    },
  };

  @track shouldRender = true;
  engineId = 'exampleAgentPanel';

  get facets() {
    return this._config.facets.map(facet => ({
      ...facet,
      id: facet.facetId || facet.field,
      isNumeric: facet.type === 'numeric',
      isCategory: facet.type === 'category',
      isTimeframe: facet.type === 'timeframe',
      isDefault: facet.type ? facet.type === 'default' : true,
      valueAs: facet.valueAs || 'checkbox',
      timeframes: facet.timeframes?.map((tf, idx) => ({
        ...tf,
        amount: tf.amount || '1',
        key: idx,
      })),
    }));
  }

  get tabs() {
    return this._config.tabs.map(tab => ({
      ...tab,
      expression: tab.expression || '',
    }));
  }

  get breadcrumb() {
    return {
      ...this._config.breadcrumb,
      categoryDivider: this._config.breadcrumb.categoryDivider || '/',
      collapseThreshold: this._config.breadcrumb.collapseThreshold || 5,
    };
  }

  get noResults() {
    return {
      ...this._config.noResults,
      disableCancelLastAction:
        this._config.noResults.disableCancelLastAction || false,
    };
  }

  get configValue() {
    return JSON.stringify(this._config, undefined, 2);
  }

  handleApply() {
    this.shouldRender = false;
    delete window.coveoHeadless[this.engineId];
    const configTextField = this.template.querySelector(
      'textarea[data-selector="jsonConfigTextArea"]'
    );
    try {
      // @ts-ignore
      const newConfig = JSON.parse(configTextField.value);
      this._config = Object.assign({}, this._config, newConfig);
      setTimeout(() => {
        this.shouldRender = true;
      }, 500);
    } catch (error) {
      console.error('Invalid JSON config ', error);
    }
  }
}
