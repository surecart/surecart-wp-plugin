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

  @Prop({ mutable: true }) order: Order;

  /** Error */
  @State() error: ResponseError | null;

  @Watch('order')
  handleOrderChange() {
    window.localStorage.setItem(`sc-checkout-order-${this.formId}`, JSON.stringify(this.order));
  }

  @Watch('load')
  handleLoad() {
    if (!this.load) return;
    if (this.order?.id) {
      this.fetchOrder(this.order.id);
    }
  }

  /** Maybe fetch order on load. */
  componentDidLoad() {
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

  render() {
    return (
      <sc-cart-session-provider
        order={this.order}
        form-id={this.formId}
        group-id={this.formId}
        onScUpdateOrderState={e => (this.order = e.detail)}
        onScError={e => (this.error = e.detail as ResponseError)}
      >
        <slot />
      </sc-cart-session-provider>
    );
  }
}
