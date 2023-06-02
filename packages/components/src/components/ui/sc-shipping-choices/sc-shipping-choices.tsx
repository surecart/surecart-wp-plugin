import { Component, Prop, h } from '@stencil/core';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-shipping-choices',
  styleUrl: 'sc-shipping-choices.scss',
  shadow: true,
})
export class ScShippingChoices {
  /** The shipping section label */
  @Prop() label:string;

  /** Show control on shipping option */
  @Prop() showControl:boolean = true;

  render() {
    return (
      <sc-form-control label={this.label || __('Shipping','surecart')}>
        <sc-flex flexDirection="column" style={{ '--sc-flex-column-gap': 'var(--sc-spacing-small)' }}>
          <sc-choice-container showControl={this.showControl}>
            <div class="shipping-choice">
              <div class="shipping-choice__name">Standard</div>
              <div class="shipping-choice__price">$300.00</div>
            </div>
          </sc-choice-container>
          <sc-choice-container showControl={this.showControl}>
            <div class="shipping-choice">
              <div class="shipping-choice__name">Express</div>
              <div class="shipping-choice__price">$300.00</div>
            </div>
          </sc-choice-container>
          <sc-choice-container showControl={this.showControl}>
            <div class="shipping-choice">
              <div class="shipping-choice__name">Air</div>
              <div class="shipping-choice__price">$300.00</div>
            </div>
          </sc-choice-container>
          <sc-choice-container showControl={this.showControl}>
            <div class="shipping-choice">
              <div class="shipping-choice__name">Foot</div>
              <div class="shipping-choice__price">$300.00</div>
            </div>
          </sc-choice-container>
        </sc-flex>
      </sc-form-control>
    );
  }
}
