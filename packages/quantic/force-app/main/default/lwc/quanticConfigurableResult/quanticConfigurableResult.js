import {LightningElement, api, track} from 'lwc';
import {TimeSpan} from 'c/quanticUtils';

/** @typedef {import("coveo").Result} Result */
/** @typedef {import("coveo").ResultTemplatesManager} ResultTemplatesManager */
/**
 * @typedef {Object} TemplateConfig
 * @property {Boolean} showLabel
 * @property {Boolean} hasThumbnail
 * @property {Boolean} hasYTDuration
 * @property {Array<Object>} metadata
 */

/**
 * The `QuanticResult` component is used internally by the `QuanticResultList` component.
 * @example
 * <c-quantic-result engine-id={engineId} result={result} result-templates-manager={resultTemplatesManager}></c-quantic-result>
 */
export default class QuanticConfigurableResult extends LightningElement {
  /**
   * The ID of the engine instance the component registers to.
   * @api
   * @type {string}
   */
  @api engineId;
  /**
   * The [result item](https://docs.coveo.com/en/headless/latest/reference/controllers/result-list/#result).
   * @api
   * @type {Result}
   */
  @api result;
  /**
   * The template manager from which to get registered custom templates.
   * @api
   * @type {ResultTemplatesManager}
   */
  @api resultTemplatesManager;

  @track resultHasPreview = true;

  connectedCallback() {
    this.template.addEventListener('haspreview', this.onHasPreview);
  }

  disconnectedCallback() {
    this.template.removeEventListener('haspreview', this.onHasPreview);
  }

  get videoThumbnail() {
    return `http://img.youtube.com/vi/${this.result.raw.ytvideoid}/mqdefault.jpg`;
  }

  get videoSourceId() {
    return `https://www.youtube.com/embed/${this.result.raw.ytvideoid}?autoplay=0`;
  }

  get videoTimeSpan() {
    return new TimeSpan(
      this.result.raw.ytvideoduration,
      false
    ).getCleanHHMMSS();
  }

  get metadatas() {
    return (
      this.templateConfig.metadata
        ?.map(meta => {
          const fieldValue = this.result.raw[meta.field];
          return fieldValue
            ? {
                label: meta.label,
                value: fieldValue,
                icon: meta.icon,
              }
            : null;
        })
        .filter(val => val != null) || []
    );
  }

  onHasPreview = evt => {
    this.resultHasPreview = evt.detail.hasPreview;
    evt.stopPropagation();
  };

  /**
   * @returns {TemplateConfig}
   */
  get templateConfig() {
    const config = this.resultTemplatesManager.selectTemplate(this.result);
    return config;
  }
}
