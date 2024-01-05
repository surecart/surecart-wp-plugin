/**
 * External dependencies.
 */
import { Component, Host, h } from '@stencil/core';
import { state } from '@store/upsell';
import { createOrUpdateUpsell } from '@store/upsell/mutations';

@Component({
  tag: 'sc-upsell',
  styleUrl: 'sc-upsell.css',
  shadow: true,
})
export class ScUpsell {
  componentWillLoad() {
    createOrUpdateUpsell();
  }

  render() {
    return (
      <Host>
        <slot />
        {state?.busy && <sc-block-ui style={{ 'z-index': '30' }}></sc-block-ui>}
      </Host>
    );
  }
}
