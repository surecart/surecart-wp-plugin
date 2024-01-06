import { Component, Host, h } from '@stencil/core';
// import { redirectUpsell } from '@store/upsell/mutations';

@Component({
  tag: 'sc-upsell-no-thanks-button',
  styleUrl: 'sc-upsell-no-thanks-button.scss',
})
export class ScUpsellNoThanksButton {
  handleNoThanksClick() {
    // redirectUpsell();
  }

  render() {
    return (
      <Host onClick={() => this.handleNoThanksClick()}>
        <slot />
      </Host>
    );
  }
}
