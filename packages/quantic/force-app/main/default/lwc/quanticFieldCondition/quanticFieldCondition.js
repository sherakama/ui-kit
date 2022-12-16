import {getBueno} from 'c/quanticHeadlessLoader';
import {LightningElement, api} from 'lwc';

/** @typedef {import("coveo").Result} Result */

/**
 * The `QuanticFieldCondition` component displays it's child elements if the given field is found on the given result.
 * @category Result Template
 * @example
 * <c-quantic-field-condition result={result} is-defined="date"></c-quantic-field-condition>
 */
export default class QuanticFieldCondition extends LightningElement {
  /**
   * The [result item](https://docs.coveo.com/en/headless/latest/reference/search/controllers/result-list/#result) to use.
   * @api
   * @type {Result}
   */
  @api result;
  /**
   * The field that must be defined on the given result.
   * @api
   * @type {string}
   */
  @api isDefined;

  /** @type {string} */
  error;
  validated = false;

  connectedCallback() {
    getBueno(this).then(() => {
      if (!this.result || !this.isDefined || !Bueno.isString(this.isDefined)) {
        console.error(
          `The ${this.template.host.localName} requires a result and a field to be specified.`
        );
        this.setError();
      }
      this.validated = true;
    });
  }

  setError() {
    this.error = `${this.template.host.localName} Error`;
  }

  /**
   * Whether the field value can be displayed.
   * @returns {boolean}
   */
  get isValid() {
    return this.validated && !this.error && !!this.fieldValue;
  }

  /**
   * The value of the given result field.
   */
  get fieldValue() {
    // @ts-ignore
    return this.isDefined ? this.result?.raw[this.isDefined] : undefined;
  }
}
