import { Component, State, h, Prop } from '@stencil/core';
import { state as checkoutState } from '@store/checkout';
import { __ } from '@wordpress/i18n';
import { isRtl } from '../../../../functions/page-align';
import { formBusy } from '@store/form/getters';
import { createOrUpdateCheckout } from '@services/session';
import { Checkout } from 'src/types';
import { updateFormState } from '@store/form/mutations';

@Component({
  tag: 'sc-order-coupon-form',
  styleUrl: 'sc-order-coupon-form.scss',
  shadow: true,
})
export class ScOrderCouponForm {
  private couponForm: HTMLScCouponFormElement;
  @Prop() label: string;
  @Prop() loading: boolean;
  @Prop() collapsed: boolean;
  @Prop() placeholder: string;
  @Prop() buttonText: string;

  @State() open: boolean;
  @State() value: string;
  @State() error: string;

  async handleCouponApply(e) {
    const promotion_code = e?.detail || null;

    try {
      this.error = null;
      updateFormState('FETCH');

      checkoutState.checkout = (await createOrUpdateCheckout({
        id: checkoutState.checkout.id,
        data: {
          discount: {
            ...(promotion_code ? { promotion_code } : {}),
          },
        },
      })) as Checkout;

      updateFormState('RESOLVE');
      await this.couponForm?.triggerFocus();
    } catch (error) {
      console.error(error);
      this.error = error?.additional_errors?.[0]?.message || error?.message || __('Something went wrong', 'surecart');
      updateFormState('REJECT');
    }
  }

  render() {
    // Do any line items have a recurring price?
    const hasRecurring = checkoutState?.checkout?.line_items?.data?.some(item => item?.price?.recurring_interval);

    return (
      <sc-coupon-form
        ref={el => (this.couponForm = el as HTMLScCouponFormElement)}
        label={this.label || __('Add Coupon Code', 'surecart')}
        collapsed={this.collapsed}
        placeholder={this.placeholder}
        loading={formBusy() && !checkoutState.checkout?.line_items?.data?.length}
        busy={formBusy()}
        discount={checkoutState.checkout?.discount}
        discounts-display-amount={checkoutState.checkout?.discounts_display_amount}
        currency={checkoutState.checkout?.currency}
        discount-amount={checkoutState.checkout?.discount_amount}
        class={{
          'order-coupon-form--is-rtl': isRtl(),
        }}
        button-text={this.buttonText || __('Apply', 'surecart')}
        show-interval={hasRecurring}
        onScApplyCoupon={e => this.handleCouponApply(e)}
        error={this.error}
      ></sc-coupon-form>
    );
  }
}
