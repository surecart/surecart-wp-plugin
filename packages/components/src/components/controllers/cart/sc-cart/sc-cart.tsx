import { Component, Fragment, h, Prop, State, Watch } from '@stencil/core';
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

  @Watch('open')
  handleOpenChange(val) {
    if (val) this.loaded = true;
  }

  render() {
    // don't render if we're on a checkout page.
    if (this.pageHasForm()) return null;

    // if we don't have a cart in storage, don't render anything.
    if (!this.alwaysShow) {
      if (!this.getSessionId() || this.getCount() === 0) return null;
    }

    // we have a cart, render all necessary components.
    return (
      <Fragment>
        <sc-cart-context-provider>
          <sc-cart-icon count={this.getCount()} onClick={() => (this.open = !this.open)}></sc-cart-icon>
          <sc-drawer label={this.cartTitle} open={this.open} onScAfterHide={() => (this.open = false)} onScAfterShow={() => (this.open = true)}>
            {this.loaded && (
              <sc-cart-provider style={{ position: 'relative', height: '100%' }} formId={this.formId}>
                <div class="cart" innerHTML={this.cartTemplate}>
                  <slot name="drawer"></slot>
                </div>
                {this.uiState === 'loading' && <sc-block-ui spinner></sc-block-ui>}
              </sc-cart-provider>
            )}

            <sc-cart-provider style={{ position: 'relative', height: '100%' }} formId={this.formId} slot="footer">
              <sc-line-item-total order={this.order} loading={this.uiState === 'loading'}>
                <span slot="title">{__('Subtotal', 'surecart')}</span>
              </sc-line-item-total>
              <br />

              <sc-button
                style={{ position: 'relative', zIndex: '99' }}
                href={this.checkoutUrl}
                type="primary"
                full
                loading={this.uiState === 'navigating'}
                onClick={() => (this.uiState = 'navigating')}
              >
                {__('Proceed To Checkout', 'surecart')}
              </sc-button>
            </sc-cart-provider>
          </sc-drawer>
        </sc-cart-context-provider>
      </Fragment>
    );
  }
}
