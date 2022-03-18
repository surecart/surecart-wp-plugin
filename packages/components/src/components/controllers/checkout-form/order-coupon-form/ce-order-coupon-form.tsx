import { Component, State, h, Watch, Prop, Event, EventEmitter } from '@stencil/core';
import { Order } from '../../../../types';
import { openWormhole } from 'stencil-wormhole';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'ce-order-coupon-form',
  styleUrl: 'ce-order-coupon-form.scss',
  shadow: true,
})
export class CeOrderCouponForm {
  @Prop() label: string;
  @Prop() loading: boolean;
  @Prop() busy: boolean;
  @Prop() error: any;
  @Prop() order: Order;
  @Prop() forceOpen: boolean;

  @State() open: boolean;
  @State() value: string;
  @State() errorMessage: string;

  @Event() ceApplyCoupon: EventEmitter<string>;

  @Watch('error')
  handleErrorsChange() {
    const error = (this?.error?.additional_errors || []).find(error => error?.data?.attribute === 'discount.promotion_code');
    this.errorMessage = error?.message ? error?.message : '';
  }

  render() {
    return (
      <ce-coupon-form
        label={this.label}
        loading={this.loading}
        busy={this.busy}
        error={this.errorMessage}
        discount={this?.order?.discount}
        currency={this?.order?.currency}
        discount-amount={this?.order?.discount_amount}
      >
        <slot>{__('Apply Coupon', 'checkout_engine')}</slot>
      </ce-coupon-form>
    );
  }
}

openWormhole(CeOrderCouponForm, ['loading', 'busy', 'order', 'error'], false);
