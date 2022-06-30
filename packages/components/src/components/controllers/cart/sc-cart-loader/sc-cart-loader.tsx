import { Component, h, Prop, State } from '@stencil/core';
import { Order } from '../../../../types';
import store from '../../../../store/checkouts';
import uiStore from '../../../../store/ui';

@Component({
  tag: 'sc-cart-loader',
  shadow: true,
})
export class ScCartLoader {
  /** The form id to use for the cart. */
  @Prop({ reflect: true }) formId: string;

  @Prop() template: string;

  @State() order: Order;

  @State() loaded: boolean;

  /**
   * Search for the sc-checkout component on a page to make sure
   * we don't show the cart on a checkout page.
   */
  pageHasForm() {
    return !!document.querySelector('sc-checkout');
  }

  render() {
    if (this.pageHasForm()) return null;
    return <div innerHTML={store?.state?.checkouts?.[this?.formId]?.line_items?.pagination?.count || uiStore?.state?.cart?.open ? this.template : ''}></div>;
  }
}
