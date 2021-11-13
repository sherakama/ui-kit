import { LightningElement, api } from 'lwc';

/**
 * The `voteTracker` component is a button to share whether a document was helpful or not. Also sends a signal to Coveo platform for ML. 
 * @example
 * <c-vote-tracker></c-vote-tracker>
 */
export default class VoteTracker extends LightningElement {
  /**
   * The label to be shown to the user.
   * @api
   * @type {string}
   */
  @api label = 'Your opinion can help others';

  /**
   * The question to be shown to the user.
   * @api
   * @type {string}
   */
  @api question = 'Was this helpful?';

  /**
   * The size of the component.
   * @api
   * @type {string}
   */
  @api size = "small";

  /**
   * The text to be shown after the vote.
   * @api
   * @type {string}
   */
  @api finalText = "Thank you for the feedback!"

  /**
   * The state of the component
   * @type {boolean}
   */
  _finalState = false;

  /**
   * Returns the css class to be given to the label
   * @returns {string}
   */
  get labelClass() {
    return this.size === 'small' ? 'slds-text-title_bold slds-m-bottom_xxx-small' : 'slds-text-heading_small title_bold slds-m-bottom_x-small';
  }

  /**
   * Returns the css class to be given to the question
   * @returns {string}
   */
  get questionClass() {
    return this.size === 'small' ? 'slds-text-title_bold text_light' : 'slds-text-heading_small';
  }

  get showAbandonRequest() {
    return this.size === 'big';
  }

  get finalState() {
    return this._finalState;
  }

  renderedCallback() {
    const positiveButton = this.template.querySelector('#yes-12');
    const negativeButton = this.template.querySelector('#no-12');

    const positiveVote = () => {
      positiveButton.state = 'selected';
      negativeButton.state = 'neutral';
      killEvents()
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        this._finalState = true
      }, 3000)
    }

    const negativeVote = () => {
      negativeButton.state = 'selected';
      positiveButton.state = 'neutral';
      killEvents()
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        this._finalState = true;
      }, 2000)
    }
    const killEvents = () => {
      positiveButton.removeEventListener('click', positiveVote);
      negativeButton.removeEventListener('click', negativeVote);
    }
    positiveButton?.addEventListener('click', positiveVote);
    negativeButton?.addEventListener('click', negativeVote);
  }
}