import { Component, State, h, Prop, Event, EventEmitter } from '@stencil/core';
import { state as checkoutState } from '@store/checkout';
import { __ } from '@wordpress/i18n';
import { isRtl } from '../../../../functions/page-align';
import { formBusy } from '@store/form/getters';

@Component({
  tag: 'sc-order-coupon-form',
  styleUrl: 'sc-order-coupon-form.scss',
  shadow: true,
})
export class ScOrderCouponForm {
  @Prop() label: string;
  @Prop() loading: boolean;
  @Prop() collapsed: boolean;
  @Prop() placeholder: string;
  @Prop() buttonText: string;

  @State() open: boolean;
  @State() value: string;

  @Event() scApplyCoupon: EventEmitter<string>;

  render() {
    // Do any line items have a recurring price?
    const hasRecurring = checkoutState?.checkout?.line_items?.data?.some(item => item?.price?.recurring_interval);

    return (
      <sc-coupon-form
        label={this.label}
        collapsed={this.collapsed}
        placeholder={this.placeholder}
        loading={formBusy() && !checkoutState.checkout?.line_items?.data?.length}
        busy={formBusy()}
        discount={checkoutState.checkout?.discount}
        currency={checkoutState.checkout?.currency}
        discount-amount={checkoutState.checkout?.discount_amount}
        class={{
          'order-coupon-form--is-rtl': isRtl(),
        }}
        button-text={this.buttonText || __('Apply', 'surecart')}
        show-interval={hasRecurring}
      ></sc-coupon-form>
    );
  }
}
