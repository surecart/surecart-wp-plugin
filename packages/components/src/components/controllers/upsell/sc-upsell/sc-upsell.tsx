/**
 * External dependencies.
 */
import { Component, Host, h } from '@stencil/core';

/**
 * Internal dependencies.
 */
import { state } from '@store/upsell';
import { createOrUpdateUpsell, redirectUpsell } from '@store/upsell/mutations';
import { isUpsellExpired } from '@store/upsell/getters';

@Component({
  tag: 'sc-upsell',
  styleUrl: 'sc-upsell.css',
  shadow: true,
})
export class ScUpsell {
  componentWillLoad() {
    createOrUpdateUpsell();
  }

  componentDidLoad() {
    this.maybeRedirectUpsell();
    setInterval(() => {
      this.maybeRedirectUpsell();
    }, 1000);
  }

  maybeRedirectUpsell() {
    if (isUpsellExpired()) {
      redirectUpsell();
    }
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
