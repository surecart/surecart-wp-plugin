import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'sc-upsell-no-thanks-button',
  styleUrl: 'sc-upsell-no-thanks-button.css',
  shadow: true,
})
export class ScUpsellNoThanksButton {
  handleCloseBump() {
    // Redirect to checkout for now.
    const checkoutUrl = window?.scData?.pages?.checkout;
    if (!!checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }

  render() {
    return (
      <Host onClick={() => this.handleCloseBump()}>
        <slot />
      </Host>
    );
  }
}
