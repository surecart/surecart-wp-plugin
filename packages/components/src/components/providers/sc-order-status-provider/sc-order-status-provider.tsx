import { Component, h, Prop, Watch, Event, EventEmitter } from '@stencil/core';
import { addQueryArgs } from '@wordpress/url';
import { Order } from '../../../types';
import apiFetch from '../../../functions/fetch';

/**
 * This component listens to the order status
 * and does necessary actions based on order state.
 */
@Component({
  tag: 'sc-order-status-provider',
  shadow: true,
})
export class ScOrderStatusProvider {
  /** The current order. */
  @Prop() order: Order;

  /** The success url. */
  @Prop() successUrl: string;

  /** Paid event */
  @Event() scPaid: EventEmitter<void>;

  /** Finalized event */
  @Event() scFinalized: EventEmitter<void>;

  @Watch('order')
  handleOrderChange() {
    this.handleStatusEvent();
    this.handleOrderEvents();
  }

  /**
   * Emit events based on order status.
   */
  handleStatusEvent() {
    if (this.order?.status === 'paid') {
      this.scPaid.emit();
    }
    if (this.order?.status === 'finalized') {
      this.scFinalized.emit();
    }
  }

  async handleOrderEvents() {
    if (this.order?.status === 'paid') {
      await this.confirmOrder();
    }
    if (this.order?.status === 'finalized') {
      await this.confirmOrder();
    }
  }

  redirect() {
    window.location.assign(addQueryArgs(this.successUrl, { order: this.order.id }));
  }

  async confirmOrder() {
    this.order = (await await apiFetch({
      path: addQueryArgs(`surecart/v1/orders/${this.order?.id}`, {
        refresh_status: true,
      }),
    })) as Order;
    return;
  }

  componentDidLoad() {
    this.handleOrderChange();
  }

  render() {
    return <slot />;
  }
}
