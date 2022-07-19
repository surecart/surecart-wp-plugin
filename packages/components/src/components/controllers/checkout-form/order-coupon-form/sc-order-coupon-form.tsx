import { Component, State, h, Watch, Prop, Event, EventEmitter } from '@stencil/core';
import { Order } from '../../../../types';
import { openWormhole } from 'stencil-wormhole';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-order-coupon-form',
  styleUrl: 'sc-order-coupon-form.scss',
  shadow: true,
})
export class ScOrderCouponForm {
  @Prop() label: string;
  @Prop() loading: boolean;
  @Prop() busy: boolean;
  @Prop() error: any;
  @Prop() order: Order;
  @Prop() forceOpen: boolean;

  @State() open: boolean;
  @State() value: string;
  @State() errorMessage: string;

  @Event() scApplyCoupon: EventEmitter<string>;

  @Watch('error')
  handleErrorsChange() {
    const error = (this?.error?.additional_errors || []).find(error => error?.data?.attribute === 'discount.promotion_code');
    this.errorMessage = error?.message ? error?.message : '';
  }

  render() {
    return (
      <sc-coupon-form
        label={this.label}
        loading={this.loading && !this.order?.id}
        busy={this.busy}
        error={this.errorMessage}
        discount={this?.order?.discount}
        currency={this?.order?.currency}
        discount-amount={this?.order?.discount_amount}
      >
        <slot>{__('Apply Coupon', 'surecart')}</slot>
      </sc-coupon-form>
    );
  }
}

openWormhole(ScOrderCouponForm, ['loading', 'busy', 'order', 'error'], false);
