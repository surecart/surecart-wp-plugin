import { Component, h, Prop } from '@stencil/core';

import { clearOrder, getOrder } from '@store/checkouts';
import uiStore from '@store/ui';

@Component({
  tag: 'sc-cart-loader',
  styleUrl: 'sc-cart-loader.scss',
  shadow: true,
})
export class ScCartLoader {
  /** The form id to use for the cart. */
  @Prop({ reflect: true }) formId: string;

  /** The mode for the form. */
  @Prop() mode: 'live' | 'test' = 'live';

  /** The cart template to inject when opened. */
  @Prop() template: string;

  render() {
    /**
     * Search for the sc-checkout component on a page to make sure
     * we don't show the cart on a checkout page.
     */
    if (!!document.querySelector('sc-checkout')) return null;

    // clear the order if it's already paid.
    const order = getOrder(this.formId, this.mode);
    if (order?.status === 'paid') {
      clearOrder(this.formId, this.mode);
      return null;
    }

    // return the loader.
    return <div innerHTML={order?.line_items?.pagination?.count || uiStore?.state?.cart?.open ? this.template : ''}></div>;
  }
}
