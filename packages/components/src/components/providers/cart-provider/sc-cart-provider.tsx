import { Component, h, Prop, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../functions/fetch';
import { baseUrl } from '../../../services/session';
import { Order, ResponseError } from '../../../types';
import { removeSessionId } from '../session-provider/helpers/session';
import { Creator, Universe } from 'stencil-wormhole';

@Component({
  tag: 'sc-cart-provider',
  shadow: true,
})
export class ScProviderCart {
  /** The form id to use for the cart. */
  @Prop() formId: string;

  /** The current UI state. */
  @Prop() uiState: 'loading' | 'busy' | 'navigating' | 'idle' = 'idle';

  /** Should we load the order? */
  @Prop() load: boolean;

  /** The order */
  @State() order: Order;

  /** Error */
  @State() error: ResponseError | null;

  /** Get the order id from storage. */
  getOrderId() {
    return this.formId ? window.localStorage.getItem(`sc-checkout-${this.formId}`) : null;
  }

  // get order from localstorage
  getCachedOrder() {
    return (JSON.parse(window.localStorage.getItem(`sc-checkout-order-${this?.formId}`)) as Order) || null;
  }

  // sync order with localstorage.
  @Watch('order')
  handleOrderChange() {
    window.localStorage.setItem(`sc-checkout-order-${this.formId}`, JSON.stringify(this.order));
  }

  @Watch('load')
  handleLoad() {
    if (!this.load) return;
    const order = this.getCachedOrder();
    if (order?.id) {
      this.fetchOrder(order.id);
    }
  }

  /** Maybe fetch order on load. */
  componentDidLoad() {
    this.order = this.getCachedOrder();
    this.handleLoad();
  }

  /** Fetch the order */
  async fetchOrder(id) {
    try {
      this.uiState = 'loading';
      this.order = (await apiFetch({
        method: 'GET', // create or update
        path: addQueryArgs(`${baseUrl}${id}`, {
          expand: ['line_items', 'line_item.price', 'price.product'],
        }),
      })) as Order;
    } catch (e) {
      // reinitalize if order not found.
      if (['order.not_found'].includes(e?.code)) {
        removeSessionId(this.formId);
      }
      console.error(e);
      throw e;
    } finally {
      this.uiState = 'idle';
    }
  }

  componentWillLoad() {
    Universe.create(this as Creator, this.state());
  }

  state() {
    return {
      processor: 'stripe',
      processor_data: this.order?.processor_data,
      uiState: this.uiState,
      loading: this.uiState === 'loading',
      busy: this.uiState === 'busy',
      navigating: this.uiState === 'navigating',
      empty: !this.order?.line_items?.pagination?.count,
      error: this.error,
      order: this.order,
      lineItems: this.order?.line_items?.data || [],
      tax_status: this?.order?.tax_status,
      customerShippingAddress: typeof this.order?.customer !== 'string' ? this?.order?.customer?.shipping_address : {},
      shippingAddress: this.order?.shipping_address,
      taxStatus: this.order?.tax_status,
      formId: this.formId,
    };
  }

  render() {
    return (
      <Universe.Provider state={this.state()}>
        <sc-cart-session-provider
          order={this.order}
          form-id={this.formId}
          group-id={this.formId}
          onScUpdateOrderState={e => (this.order = e.detail)}
          onScError={e => (this.error = e.detail as ResponseError)}
        >
          <slot />
        </sc-cart-session-provider>
      </Universe.Provider>
    );
  }
}
