import { LightningElement, api } from 'lwc';
import helpedUsers from '@salesforce/label/c.cookbook_HelpedUsers';
import helpedUsers_plural from '@salesforce/label/c.cookbook_HelpedUsers_plural';
import helpedUsers_zero from '@salesforce/label/c.cookbook_HelpedUsers_zero';
import { I18nUtils } from 'c/quanticUtils';



/**
 * The `voteCount` component is an indicator of how many people said that a document was helpful. 
 * @example
 * <c-vote-count></c-vote-count>
 */
export default class VoteCount extends LightningElement {
  labels = {
    helpedUsers,
    helpedUsers_plural,
    helpedUsers_zero
  }

  /**
   * The count to be shown to the user.
   * @api
   * @type {number}
   * @defaultValue `0`
   */
  @api count = 0;

  /**
   * The alternative text to be assigned to the button icon.
   * @api
   * @type {string}
   */
  @api altText;

  /**
   * Returns the label to show with the count value.c/descriptionStrengthIndicator
   * @returns {string}
   */
  get label() {
    const labelName = I18nUtils.getLabelNameWithCount('helpedUsers', this.count)
    return I18nUtils.format(this.labels[labelName], this.count);
  }
}