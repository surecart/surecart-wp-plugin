import { Component, Prop, h, Host } from '@stencil/core';
import { __, sprintf } from '@wordpress/i18n';
import { state as checkoutState } from '@store/checkout';
import { Address, Checkout, ShippingMethod } from '../../../types';
import { lockCheckout, unLockCheckout } from '@store/checkout/mutations';
import { createOrUpdateCheckout } from '@services/session';
import { checkoutIsLocked } from '@store/checkout/getters';
import { createErrorNotice } from '@store/notices/mutations';
import { speak } from '@wordpress/a11y';
import { getFormattedPrice } from '../../../functions/price';

/**
 * @part base - The elements base wrapper.
 * @part empty - The empty message.
 * @part block-ui - The block ui loader.
 * @part radio__base - The radio base wrapper.
 * @part radio__label - The radio label.
 * @part radio__control - The radio control wrapper.
 * @part radio__checked-icon - The radio checked icon.
 */
@Component({
  tag: 'sc-shipping-choices',
  styleUrl: 'sc-shipping-choices.scss',
  shadow: true,
})
export class ScShippingChoices {
  /** The shipping section label */
  @Prop() label: string;

  /** Whether to show the shipping choice description */
  @Prop() showDescription: boolean = true;

  /** Maybe update the order. */
  async updateCheckout(selectedShippingChoiceId: string) {
    if (!selectedShippingChoiceId) return;
    try {
      lockCheckout('selected_shipping_choice');
      checkoutState.checkout = (await createOrUpdateCheckout({
        id: checkoutState.checkout.id,
        data: {
          selected_shipping_choice_id: selectedShippingChoiceId,
        },
      })) as Checkout;

      speak(__('Shipping choice updated.', 'surecart'), 'assertive');
      const { total_amount, currency } = checkoutState.checkout;

      /** translators: %1$s: formatted amount */
      speak(sprintf(__('Your order total has changed to: %1$s.', 'surecart'), getFormattedPrice({ amount: total_amount, currency })), 'assertive');
    } catch (e) {
      console.error(e);
      createErrorNotice(e);
    } finally {
      unLockCheckout('selected_shipping_choice');
    }
  }

  render() {
    // shipping choice is not rewquired.
    if (!checkoutState?.checkout?.selected_shipping_choice_required) {
      return <Host style={{ display: 'none' }}></Host>;
    }

    // no shipping choices but no country either
    if (!checkoutState?.checkout?.shipping_choices?.data?.length && !(checkoutState?.checkout?.shipping_address as Address)?.country) {
      return (
        <sc-form-control label={this.label || __('Shipping', 'surecart')}>
          <div class="shipping-choice__empty">{__('To check available shipping choices, please provide your shipping country in the address section.', 'surecart')}</div>
        </sc-form-control>
      );
    }

    // no shipping choices yet.
    if (!checkoutState?.checkout?.shipping_choices?.data?.length) {
      return (
        <sc-form-control part="empty" label={this.label || __('Shipping', 'surecart')}>
          <div class="shipping-choice__empty">{__('Sorry, we are not able to ship to your address.', 'surecart')}</div>
        </sc-form-control>
      );
    }

    return (
      <Host>
        <sc-radio-group part="base" label={this.label || __('Shipping', 'surecart')} class="shipping-choices" onScChange={e => this.updateCheckout(e.detail)}>
          {(checkoutState?.checkout?.shipping_choices?.data || []).map(({ id, display_amount, shipping_method }) => (
            <sc-radio
              key={id}
              checked={checkoutState?.checkout?.selected_shipping_choice === id}
              exportparts="base:radio__base,label:radio__label,control:radio__control,checked-icon:radio__checked-icon"
              class="shipping-choice"
              value={id}
            >
              <div class="shipping-choice__text">
                <div class="shipping-choice__name">{(shipping_method as ShippingMethod)?.name || __('Standard Shipping', 'surecart')}</div>
                {this.showDescription && !!(shipping_method as ShippingMethod)?.description && (
                  <div class="shipping-choice__description">{(shipping_method as ShippingMethod)?.description}</div>
                )}
              </div>
              <div class="shipping-choice__price">{!!display_amount ? display_amount : __('Free', 'surecart')}</div>
            </sc-radio>
          ))}
        </sc-radio-group>
        {checkoutIsLocked('selected_shipping_choice') && <sc-block-ui></sc-block-ui>}
      </Host>
    );
  }
}
