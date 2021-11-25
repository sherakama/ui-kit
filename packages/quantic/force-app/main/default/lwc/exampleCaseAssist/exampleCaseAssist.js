import {LightningElement, api} from 'lwc';

export default class ExampleCaseAssist extends LightningElement {
  /** @type {string} */
  @api engineId = 'example-case-assist';
  /** @type {string} */
  @api caseAssistId = 'default';
}