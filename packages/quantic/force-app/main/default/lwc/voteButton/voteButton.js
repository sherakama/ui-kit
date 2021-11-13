import { LightningElement, api } from 'lwc';

export default class VoteButton extends LightningElement {
  /**
   * The label of the button.
   * @api
   * @type {string}
   */
  @api label = 'Yes';

  /**
   * The type of the button.
   * @api
   * @type {string}
   */
  @api type = 'negative'

  /**
   * The size of the button.
   * @api
   * @type {string}
   */
  @api size = 'small'

  /**
   * The state of the button. initial / neutral / selected
   * @api
   * @type {string}
   */
  @api state = 'initial'

  /**
   * The name of the icon to be in the button.
   * @api
   * @type {string}
   */
  @api iconName = 'utility:clear'

  get iconSize() {
    return this.size === 'big' ? 'x-small' : 'xx-small'
  }

  get iconClass() {
    let className = this.size === 'big' ? 'slds-m-right_x-small' : 'slds-m-right_xx-small';
    if(this.state === 'initial'){
      className+= ' icon-color_initial'
    }
    return className
  }

  get labelClass() {
    let className = this.size === 'big' ? 'slds-text-heading_small ' : '';
    if (this.state === 'neutral') {
      className += 'slds-text-color_weak';
    } else if (this.state === 'initial') {
      className += 'text-color_initial';
    } else if (this.type === "positive") {
      className += 'slds-text-color_success';
    } else {
      className += 'slds-text-color_error';
    }
    return className;
  }

  get iconVariant(){
    if(this.state !== 'selected'){
      return '';
    }else if(this.type ==='positive'){
      return 'success';
    }
    return 'error';
  }

}