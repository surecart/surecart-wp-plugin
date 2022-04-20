import { Component, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../functions/fetch';
import { baseUrl } from '../../../services/session';
import { Order, ResponseError } from '../../../types';
import { removeSessionId } from '../session-provider/helpers/session';
import { Universe } from 'stencil-wormhole';

@Component({
  tag: 'sc-cart-provider',
  shadow: true,
})
export class ScCart {
  /** The form id to use for the cart. */
  @Prop() formId: string;

  /** The current UI state. */
  @Prop() uiState: 'loading' | 'busy' | 'navigating' | 'idle' = 'idle';

  /** The order */
  @State() order: Order;

  /** Error */
  @State() error: ResponseError | null;

  /** Get the order id from storage. */
  getOrderId() {
    return this.formId ? window.localStorage.getItem(this.formId) : null;
  }

  /** Maybe fetch order on load. */
  componentDidLoad() {
    const order_id = this.getOrderId();
    if (order_id) {
      this.fetchOrder(order_id);
    }
  }

  /** Fetch the order */
  async fetchOrder(id) {
    try {
      this.uiState = 'loading';
      this.order = (await apiFetch({
        method: 'GET', // create or update
        path: addQueryArgs(baseUrl, {
          id,
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
    // @ts-ignore
    Universe.create(this, this.state());
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
        <slot />
        {this.state().busy && <sc-block-ui z-index={9}></sc-block-ui>}
      </Universe.Provider>
    );
  }
}
