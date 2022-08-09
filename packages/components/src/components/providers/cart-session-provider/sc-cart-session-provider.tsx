import { Component, Element, Event, EventEmitter, h, Listen, Prop, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';

import { updateOrder } from '../../../services/session';
import { Checkout, LineItemData } from '../../../types';

@Component({
  tag: 'sc-cart-session-provider',
  shadow: true,
})
export class ScCartSessionProvider {
  /** Element */
  @Element() el: HTMLElement;

  /** Order Object */
  @Prop() order: Checkout;

  /** Update line items event */
  @Event() scUpdateOrderState: EventEmitter<Checkout>;

  /** Error event */
  @Event() scError: EventEmitter<{ message: string; code?: string; data?: any; additional_errors?: any } | {}>;

  /** Set the state */
  @Event() scSetState: EventEmitter<'loading' | 'busy' | 'navigating' | 'idle'>;

  /** Holds the checkout session to update. */
  @State() session: Checkout;

  /** Sync this session back to parent. */
  @Watch('session')
  handleSessionUpdate(val) {
    this.scUpdateOrderState.emit(val);
  }

  @Listen('scUpdateOrder')
  handleUpdateSession(e) {
    const { data, options } = e.detail;
    if (options?.silent) {
      this.update(data);
    } else {
      this.loadUpdate(data);
    }
  }

  /** Handles coupon updates. */
  @Listen('scApplyCoupon')
  async handleCouponApply(e) {
    const promotion_code = e.detail;
    this.scError.emit({});
    this.loadUpdate({
      discount: {
        ...(promotion_code ? { promotion_code } : {}),
      },
    });
  }

  /** Handle the error response. */
  handleErrorResponse(e) {
    if (e?.code === 'readonly') {
      this.scUpdateOrderState.emit(null);
    }

    // expired
    if (e?.code === 'rest_cookie_invalid_nonce') {
      this.scSetState.emit('idle');
      return;
    }

    // something went wrong
    if (e?.message) {
      this.scError.emit(e);
    }

    // handle curl timeout errors.
    if (e?.code === 'http_request_failed') {
      this.scError.emit({ message: 'Something went wrong. Please reload the page and try again.' });
    }

    this.scSetState.emit('idle');
  }

  /** Fetch a session. */
  async fetch(args = {}) {
    this.loadUpdate({ status: 'draft', ...args });
  }

  /** Update a the order */
  async update(data = {}, query = {}) {
    try {
      this.session = (await updateOrder({
        id: this.order?.id,
        data: {
          ...data,
        },
        query: {
          ...query,
        },
      })) as Checkout;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  /** Updates a session with loading status changes. */
  async loadUpdate(data = {}) {
    try {
      this.scSetState.emit('busy');
      await this.update(data);
      this.scSetState.emit('idle');
    } catch (e) {
      this.handleErrorResponse(e);
    }
  }

  render() {
    return (
      <sc-line-items-provider order={this.order} onScUpdateLineItems={e => this.loadUpdate({ line_items: e.detail as Array<LineItemData> })}>
        <slot />
      </sc-line-items-provider>
    );
  }
}
