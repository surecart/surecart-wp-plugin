import { Component, Host, h } from '@stencil/core';
import { cancel } from '@store/upsell/mutations';

@Component({
  tag: 'sc-upsell-no-thanks-button',
  styleUrl: 'sc-upsell-no-thanks-button.scss',
})
export class ScUpsellNoThanksButton {
  render() {
    return (
      <Host onClick={() => cancel()}>
        <slot />
      </Host>
    );
  }
}
