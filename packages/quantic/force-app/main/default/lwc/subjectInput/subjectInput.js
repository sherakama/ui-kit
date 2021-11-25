import { LightningElement, api } from 'lwc';
import {
  registerComponentForInit,
  initializeWithHeadless,
} from 'c/quanticHeadlessLoader';

/** @typedef {import("coveo").CaseInput} CaseInput */

/**
 * The `SubjectInput` component  displays a text input for the case subject.
 * @example
 * <c-subject-input label="Write a descriptive title" maxLength="50" message-when-value-missing="Complete this field." required></c-subject-input>
 */
export default class SubjectInput extends LightningElement {

  /**
   * The ID of the engine instance the component registers to.
   * @type {string}
   */
  @api engineId;

  /**
   * The label of the input.
   * @type {string}
   * @defaultValue `'Write a descriptive title'`
   */
  @api label = 'Write a descriptive title';

  /**
   * The maximum length of the string to be written in the input.
   * @type {number}
   * @defaultValue `100`
   */
  @api maxLength = 100;

  /**
   * Tells if the input is required.
   * @type {boolean}
   * @defaultValue `false`
   */
  @api required = false;

  /**
   * The error message to be shown when the value is missing.
   * @type {string}
   * @defaultValue `'Complete this field.`
   */
  @api messageWhenValueMissing = 'Complete this field.';

  /** @type {string} */
  _value = '';

  /** @type {string} */
  _errorMessage = '';

  /** @type {CaseInput} */
  caseInput


  connectedCallback() {
    registerComponentForInit(this, this.engineId);
  }

  renderedCallback() {
    initializeWithHeadless(this, this.engineId, this.initialize);
  }

  initialize = (engine) => {
    this.caseInput = CoveoHeadlessCaseAssist.buildCaseInput(engine, {
      field: 'subject'
    });
    this.unsubscribeCaseInput = this.caseInput.subscribe(() => this.updateState());
  }

  updateState() {
    console.log(this.caseInput.state)
  }

  /**
   * Handles the changes in the input.
   * @return {void}
   */
  handleChange = (e) => {
    this._errorMessage = '';
    this._value =
      e.target.value.length <= this.maxLength
        ? e.target.value
        : e.target.value.substring(0, this.maxLength);

    this.caseInput.update(this.value);
    this.caseInput.fetchCaseClassifications();
  };

  /**
   * Returns the value of the input.
   * @api
   * @returns {string}
   */
  @api get value() {
    return this._value;
  }

  /**
   * Returns the length of the value of the input.
   * @returns {number}
   */
  get length() {
    return this._value.length;
  }
  /**
   * Returns the error message to be shown.
   * @type {string}
   */
  get errorMessage() {
    return this._errorMessage;
  }

  /**
   * Returns the CSS class of the form.
   * @returns {string}
   */
  get formClass() {
    return this.hasError
      ? 'slds-form-element slds-has-error'
      : 'slds-form-element';
  }

  /**
   * Tells if there is an error in the input.
   * @returns {boolean}
   */
  @api get hasError() {
    return !!this._errorMessage.length;
  }

  /**
   * Shows an error message in the componet if there is an error.
   * @returns {void}
   */
  @api reportValidity() {
    const input = this.template.querySelector('input');
    if (input.validity.valueMissing) {
      this._errorMessage = this.messageWhenValueMissing;
    }
  }
}
