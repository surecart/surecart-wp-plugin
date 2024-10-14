import { Component, State, h, Prop } from '@stencil/core';
import { state as checkoutState } from '@store/checkout';
import { __ } from '@wordpress/i18n';
import { isRtl } from '../../../../functions/page-align';
import { formBusy } from '@store/form/getters';
import { removeNotice } from '@store/notices/mutations';
import { createOrUpdateCheckout } from '@services/session';
import { Checkout } from 'src/types';

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
  @State() error: object | null;

  async handleCouponApply(e) {
    const promotion_code = e.detail;
    removeNotice();

    try {
      checkoutState.checkout = (await createOrUpdateCheckout({
        id: checkoutState.checkout.id,
        data: {
          discount: {
            ...(promotion_code ? { promotion_code } : {}),
          },
        },
      })) as Checkout;

      requestAnimationFrame(() => {
        // Focus on the sc-tag element.
        (
          document
            ?.querySelector('sc-order-coupon-form')
            ?.shadowRoot?.querySelector('sc-coupon-form')
            ?.shadowRoot?.querySelector('sc-line-item')
            ?.querySelector('sc-tag')
            ?.shadowRoot.querySelector('*') as HTMLElement
        )?.focus();
      });
    } catch (error) {
      this.error = error;
      console.error(error);
    }
  }

  render() {
    // Do any line items have a recurring price?
    const hasRecurring = checkoutState?.checkout?.line_items?.data?.some(item => item?.price?.recurring_interval);

    return (
      <sc-coupon-form
        label={this.label || __('Add Coupon Code', 'surecart')}
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
        onScApplyCoupon={this.handleCouponApply}
      ></sc-coupon-form>
    );
  }
}
