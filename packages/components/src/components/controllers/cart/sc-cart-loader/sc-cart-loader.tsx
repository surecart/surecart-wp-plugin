import { Component, h, Prop } from '@stencil/core';
import { state as checkoutState } from '@store/checkout';
import uiStore from '@store/ui';

@Component({
  tag: 'sc-cart-loader',
  styleUrl: 'sc-cart-loader.scss',
  shadow: false,
})
export class ScCartLoader {
  /** The cart template to inject when opened. */
  @Prop() template: string;

  render() {
    // check for forms.
    if (document.querySelector('sc-checkout')) {
      return;
    }

    // clear the order if it's already paid.
    if (checkoutState?.checkout?.status === 'paid') {
      checkoutState.checkout = null;
      return null;
    }

    // return the loader.
    return <div innerHTML={checkoutState?.checkout?.line_items?.pagination?.count || uiStore?.state?.cart?.open ? this.template : ''}></div>;
  }
}
