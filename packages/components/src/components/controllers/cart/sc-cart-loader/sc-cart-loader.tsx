import { Component, h, Prop } from '@stencil/core';

import { clearCheckout, getCheckout } from '@store/checkouts/mutations';
import uiStore from '@store/ui';

@Component({
  tag: 'sc-cart-loader',
  styleUrl: 'sc-cart-loader.scss',
  shadow: false,
})
export class ScCartLoader {
  /** The form id to use for the cart. */
  @Prop({ reflect: true }) formId: string;

  /** The mode for the form. */
  @Prop() mode: 'live' | 'test' = 'live';

  /** The cart template to inject when opened. */
  @Prop() template: string;

  render() {
    // check for forms.
    if (document.querySelector('sc-checkout')) {
      return;
    }

    // clear the order if it's already paid.
    const order = getCheckout(this.formId, this.mode);
    if (order?.status === 'paid') {
      clearCheckout(this.formId, this.mode);
      return null;
    }

    // return the loader.
    return <div innerHTML={order?.line_items?.pagination?.count || uiStore?.state?.cart?.open ? this.template : ''}></div>;
  }
}
