/* eslint-disable @lwc/lwc/no-async-operation */
// @ts-ignore
import youtubeTemplate from './resultTemplates/youtubeResultTemplate.html';
// @ts-ignore
import caseTemplate from './resultTemplates/caseResultTemplate.html';
// @ts-ignore
import chatterTemplate from './resultTemplates/chatterResultTemplate.html';
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
  @track _configValue = {
    templates: [],
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
            unit: 'week'
          },
          {
            unit: 'month'
          },
          {
            unit: 'month',
            amount: 6
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
        label: 'Articles',
        expression: '@sfkbid'
      },
      {
        label: 'Issues',
        expression: '@jisourcetype AND NOT @jidocumenttype="WorkLog"'
      },
      {
        label: 'Community',
        expression: '@objecttype=="Message"'
      },
      {
        label: 'Files',
        expression: '@boxdocumenttype==File OR @spcontenttype==Document'
      },
    ]
  };

  @track shouldRender = true;
  engineId = 'exampleAgentPanel';

  get facets() {
    return this._configValue.facets.map(facet => ({
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
        key: idx
      }))
    }));
  }

  get tabs() {
    return this._configValue.tabs.map(tab => ({
      ...tab,
      expression: tab.expression || ''
    }));
  }

  get configValue() {
    return JSON.stringify(this._configValue, undefined, 2);
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
      this._configValue = Object.assign({}, this._configValue, newConfig);
      setTimeout(() => {
        this.shouldRender = true;
      }, 500);
    } catch (error) {
      console.error('Invalid JSON config ', error);
    }
  }

  handleResultTemplateRegistration(event) {
    event.stopPropagation();

    const resultTemplatesManager = event.detail;

    const isCase = CoveoHeadless.ResultTemplatesHelpers.fieldMustMatch(
      'objecttype',
      ['Case']
    );
    const isYouTube = CoveoHeadless.ResultTemplatesHelpers.fieldMustMatch(
      'filetype',
      ['YouTubeVideo']
    );
    const isChatter = CoveoHeadless.ResultTemplatesHelpers.fieldMustMatch(
      'objecttype',
      ['FeedItem']
    );
    resultTemplatesManager.registerTemplates(
      {
        content: youtubeTemplate,
        conditions: [isYouTube],
        fields: ['ytvideoid', 'ytvideoduration'],
      },
      {
        content: caseTemplate,
        conditions: [isCase],
        fields: ['sfstatus', 'sfcasestatus', 'sfcasenumber'],
      },
      {
        content: chatterTemplate,
        conditions: [isChatter],
        fields: ['sfcreatedbyname'],
      }
    );
  }
}
