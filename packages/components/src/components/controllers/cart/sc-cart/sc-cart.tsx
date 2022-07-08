import { Component, Fragment, h, Listen, Prop, State, Watch } from '@stencil/core';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { Creator, Universe } from 'stencil-wormhole';
import { baseUrl } from '../../../../services/session';
import { getOrder, setOrder } from '../../../../store/checkouts';
import uiStore from '../../../../store/ui';
import { Order, ResponseError } from '../../../../types';

@Component({
  tag: 'sc-cart',
  styleUrl: 'sc-cart.scss',
  shadow: true,
})
export class ScCart {
  /** Is this open or closed? */
  @State() open: boolean = null;

  /** The form id to use for the cart. */
  @Prop({ reflect: true }) formId: string;

  /** The header for the popout. */
  @Prop() header: string;

  /** The template for the cart to inject when opened. */
  @Prop() cartTemplate: string;

  /** Are we in test or live mode. */
  @Prop() mode: 'test' | 'live' = 'live';

  /** The checkout url for the button. */
  @Prop() checkoutUrl: string;

  /** Should we force show the cart, even if there's a form on the page? */
  @Prop() alwaysShow: boolean;

  /** The current UI state. */
  @State() uiState: 'loading' | 'busy' | 'navigating' | 'idle' = 'idle';

  /** Error state. */
  @State() error: ResponseError | null;

  @Watch('open')
  handleOpenChange() {
    uiStore.set('cart', { ...uiStore.state.cart, ...{ open: this.open } });
    if (this.open === true) {
      this.fetchOrder();
    }
  }

  order() {
    return getOrder(this.formId, this.mode);
  }

  setOrder(data) {
    setOrder(data, this.formId);
  }

  /**
   * Search for the sc-checkout component on a page to make sure
   * we don't show the cart on a checkout page.
   */
  pageHasForm() {
    return !!document.querySelector('sc-checkout');
  }

  /** Count the number of items in the cart. */
  getItemsCount() {
    const items = this.order()?.line_items?.data;
    let count = 0;
    items.forEach(item => {
      count = count + item?.quantity;
    });
    return count;
  }

  @Listen('scSetState')
  handleSetState(e) {
    this.uiState = e.detail;
  }

  /** Listen for error events in component. */
  @Listen('scError')
  handleErrorEvent(e) {
    this.error = e.detail as ResponseError;
    this.uiState = 'idle';
  }

  @Listen('scCloseCart')
  handleCloseCart() {
    this.open = false;
  }

  /** Fetch the order */
  async fetchOrder() {
    try {
      this.uiState = 'loading';
      const order = (await apiFetch({
        method: 'GET', // create or update
        path: addQueryArgs(`${baseUrl}${this.order()?.id}`, {
          expand: [
            'line_items',
            'line_item.price',
            'price.product',
            'customer',
            'customer.shipping_address',
            'payment_intent',
            'discount',
            'discount.promotion',
            'discount.coupon',
            'shipping_address',
            'tax_identifier',
          ],
        }),
      })) as Order;
      this.setOrder(order);
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      this.uiState = 'idle';
    }
  }

  componentWillLoad() {
    Universe.create(this as Creator, this.state());
    this.open = !!uiStore.state.cart.open;
    uiStore.onChange('cart', cart => {
      this.open = cart.open;
    });
  }

  state() {
    return {
      processor_data: this.order()?.processor_data,
      uiState: this.uiState,
      loading: this.uiState === 'loading',
      busy: this.uiState === 'busy',
      navigating: this.uiState === 'navigating',
      empty: !this.order()?.line_items?.pagination?.count,
      error: this.error,
      order: this.order(),
      lineItems: this.order()?.line_items?.data || [],
      tax_status: this.order()?.tax_status,
      customerShippingAddress: typeof this.order()?.customer !== 'string' ? this.order()?.customer?.shipping_address : {},
      shippingAddress: this.order()?.shipping_address,
      taxStatus: this.order()?.tax_status,
      formId: this.formId,
    };
  }

  render() {
    return (
      <Fragment>
        {this.order() && (
          <Universe.Provider state={this.state()}>
            <sc-cart-session-provider
              order={this.order()}
              form-id={this.formId}
              group-id={this.formId}
              onScUpdateOrderState={e => this.setOrder(e.detail)}
              onScError={e => (this.error = e.detail as ResponseError)}
            >
              <sc-cart-icon count={this.getItemsCount()} onClick={() => (this.open = !this.open)}></sc-cart-icon>

              <sc-drawer open={this.open} onScAfterHide={() => (this.open = false)} onScAfterShow={() => (this.open = true)}>
                {this.open === true && (
                  <Fragment>
                    <div class="cart__header-suffix" slot="header">
                      <slot name="cart-header" />
                      <sc-error style={{ '--sc-alert-border-radius': '0' }} slot="header" error={this.error} onScUpdateError={e => (this.error = e.detail)}></sc-error>
                    </div>

                    <slot />

                    <div class="cart_footer" slot="footer">
                      <sc-cart-session-provider
                        order={this.order()}
                        form-id={this.formId}
                        group-id={this.formId}
                        onScUpdateOrderState={e => this.setOrder(e.detail)}
                        onScError={e => (this.error = e.detail as ResponseError)}
                      >
                        <slot name="cart-footer" />
                      </sc-cart-session-provider>
                    </div>
                  </Fragment>
                )}
                {this.uiState === 'busy' && <sc-block-ui z-index={9}></sc-block-ui>}
              </sc-drawer>
            </sc-cart-session-provider>
          </Universe.Provider>
        )}
      </Fragment>
    );
  }
}
