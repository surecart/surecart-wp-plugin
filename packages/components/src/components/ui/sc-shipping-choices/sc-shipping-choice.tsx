import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'sc-shipping-choices',
  styleUrl: 'sc-shipping-choices.scss',
  shadow: true,
})
export class ScShippingChoices {
  render() {
    return (
      <Host>
        <sc-flex flexDirection="column" style={{ '--sc-flex-column-gap': 'var(--sc-spacing-medium)' }}>
          <sc-choice-container>
            <div class="shipping-choice">
              <div class="shipping-choice__name">Standard</div>
              <div class="shipping-choice__price">$300.00</div>
            </div>
          </sc-choice-container>
          <sc-choice-container>
            <div class="shipping-choice">
              <div class="shipping-choice__name">Express</div>
              <div class="shipping-choice__price">$300.00</div>
            </div>
          </sc-choice-container>
          <sc-choice-container>
            <div class="shipping-choice">
              <div class="shipping-choice__name">Air</div>
              <div class="shipping-choice__price">$300.00</div>
            </div>
          </sc-choice-container>
          <sc-choice-container>
            <div class="shipping-choice">
              <div class="shipping-choice__name">Foot</div>
              <div class="shipping-choice__price">$300.00</div>
            </div>
          </sc-choice-container>
        </sc-flex>
      </Host>
    );
  }
}
