import { Component, Host, h } from '@stencil/core';
import { decline } from '@store/upsell/mutations';

@Component({
  tag: 'sc-upsell-no-thanks-button',
  styleUrl: 'sc-upsell-no-thanks-button.scss',
})
export class ScUpsellNoThanksButton {
  render() {
    return (
      <Host onClick={() => decline()}>
        <slot />
      </Host>
    );
  }
}
