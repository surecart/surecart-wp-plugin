import { Component, h, Listen, Prop, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';

import { Order, ResponseError } from '../../../../types';

@Component({
  tag: 'sc-cart',
  styleUrl: 'sc-cart.scss',
  shadow: true,
})
export class ScCart {
  /** Is this open or closed? */
  @State() open: boolean = false;

  /** The template for the pop-out cart. */
  @Prop() cartTemplate: string;

  /** The title for the cart. */
  @Prop() cartTitle: string;

  /** The button text. */
  @Prop() buttonText: string = 'Proceed To Checkout';

  /** The form id to use for the cart. */
  @Prop({ reflect: true }) formId: string;

  /** The checkout url for the button. */
  @Prop() checkoutUrl: string;

  /** The current UI state. */
  @Prop() uiState: 'loading' | 'busy' | 'navigating' | 'idle' = 'idle';

  /** Should we force show the cart, even if there's a form on the page? */
  @Prop() alwaysShow: boolean;

  @State() order: Order;

  @State() error: ResponseError | null;

  @State() loaded: boolean = false;

  /**
   * Search for the sc-checkout component on a page to make sure
   * we don't show the cart on a checkout page.
   */
  pageHasForm() {
    return !!document.querySelector('sc-checkout');
  }

  getCount() {
    return parseInt(window.localStorage.getItem(`sc-checkout-${this.formId}-line-items-count`) || '0');
  }

  getSessionId() {
    return this.formId ? window.localStorage.getItem(`sc-checkout-${this.formId}`) : null;
  }

  // get order from localstorage
  getCachedOrder() {
    return (JSON.parse(window.localStorage.getItem(`sc-checkout-order-${this?.formId}`)) as Order) || null;
  }

  getItemsCount() {
    const items = this.getCachedOrder()?.line_items?.data;
    let count = 0;
    items.forEach(item => {
      count = count + item?.quantity;
    });
    return count;
  }

  @Watch('open')
  handleOpenChange(val) {
    if (val) this.loaded = true;
  }

  @Listen('scSetState')
  handleSetState(e) {
    this.uiState = e.detail;
  }

  render() {
    // don't render if we're on a checkout page.
    if (this.pageHasForm()) return null;

    // if we don't have a cart in storage, don't render anything.
    if (!this.alwaysShow) {
      if (!this.getCachedOrder() || this.getCachedOrder()?.line_items?.pagination?.count === 0) return null;
    }

    // we have a cart, render all necessary components.
    return (
      <sc-cart-provider load={this.loaded} uiState={this.uiState} formId={this.formId}>
        <sc-cart-icon count={this.getItemsCount()} onClick={() => (this.open = !this.open)}></sc-cart-icon>
        <sc-drawer no-header label={this.cartTitle} open={this.open} onScAfterHide={() => (this.open = false)} onScAfterShow={() => (this.open = true)}>
          <slot />
          {this.uiState === 'busy' && <sc-block-ui z-index={9}></sc-block-ui>}
        </sc-drawer>
      </sc-cart-provider>
    );
  }
}
