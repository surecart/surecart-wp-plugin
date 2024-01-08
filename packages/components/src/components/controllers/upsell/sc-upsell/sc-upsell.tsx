/**
 * External dependencies.
 */
import { Component, Host, h } from '@stencil/core';
import { addQueryArgs } from '@wordpress/url';

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
    // For Preview mode, prevent it from redirecting to the upsell page.
    const isPreviewed = addQueryArgs(window.location.href, { preview: true });
    if (isPreviewed) {
      return;
    }

    this.maybeRedirectUpsell();
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
