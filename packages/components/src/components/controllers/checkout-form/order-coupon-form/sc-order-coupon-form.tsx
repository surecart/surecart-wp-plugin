import { Component, State, h, Watch, Prop, Event, EventEmitter } from '@stencil/core';
import { Checkout } from '../../../../types';
import { openWormhole } from 'stencil-wormhole';
import { __ } from '@wordpress/i18n';
import { isRtl } from '../../../../functions/page-align';

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
  @Prop() order: Checkout;
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
        label={this.label || __('Add Coupon Code', 'surecart')}
        loading={this.busy && !this.order?.line_items?.data?.length}
        busy={this.busy}
        error={this.errorMessage}
        discount={this?.order?.discount}
        currency={this?.order?.currency}
        discount-amount={this?.order?.discount_amount}
        class={{
          'order-coupon-form--is-rtl':isRtl()
        }}
      >
        <slot>{__('Apply', 'surecart')}</slot>
      </sc-coupon-form>
    );
  }
}

openWormhole(ScOrderCouponForm, ['loading', 'busy', 'order', 'error'], false);
