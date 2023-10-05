import { Component, Prop, h, Host } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { state as checkoutState } from '@store/checkout';
import { Checkout, ShippingMethod } from '../../../types';
import { lockCheckout, unLockCheckout } from '@store/checkout/mutations';
import { createOrUpdateCheckout } from '@services/session';
import { checkoutIsLocked } from '@store/checkout/getters';
import { createErrorNotice } from '@store/notices/mutations';

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

    // no shipping choices yet.
    if (!checkoutState?.checkout?.shipping_choices?.data?.length) {
      return (
        <sc-form-control label={this.label || __('Shipping', 'surecart')}>
          <div class="shipping-choice__empty">{__('Sorry, we are not able to ship to your address.', 'surecart')}</div>
        </sc-form-control>
      );
    }

    return (
      <Host>
        <sc-radio-group label={this.label || __('Shipping', 'surecart')} class="shipping-choices" onScChange={e => this.updateCheckout(e.detail)}>
          {(checkoutState?.checkout?.shipping_choices?.data || []).map(({ id, amount, currency, shipping_method }) => (
            <sc-radio key={id} checked={checkoutState?.checkout?.selected_shipping_choice === id} class="shipping-choice" value={id}>
              <div class="shipping-choice__text">
                <div class="shipping-choice__name">{(shipping_method as ShippingMethod)?.name || __('Standard Shipping', 'surecart')}</div>
                {this.showDescription && !!(shipping_method as ShippingMethod)?.description && (
                  <div class="shipping-choice__description">{(shipping_method as ShippingMethod)?.description}</div>
                )}
              </div>
              <div class="shipping-choice__price">{!!amount ? <sc-format-number type="currency" value={amount} currency={currency} /> : __('Free', 'surecart')}</div>
            </sc-radio>
          ))}
        </sc-radio-group>
        {checkoutIsLocked() && <sc-block-ui></sc-block-ui>}
      </Host>
    );
  }
}
