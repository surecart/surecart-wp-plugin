import { Component, Prop, h, EventEmitter, Event, Host } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { state as checkoutState, onChange } from '@store/checkout';
import { Checkout, ResponseError, ShippingChoice, ShippingMethod } from '../../../types';
import { lockCheckout, unLockCheckout } from '@store/checkout/mutations';
import { createOrUpdateCheckout } from '@services/session';
import { checkoutIsLocked } from '@store/checkout/getters';

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

  /** Shipping choices */
  @Prop({ mutable: true }) shippingChoices: ShippingChoice[] = [];

  /** Error event */
  @Event() scError: EventEmitter<ResponseError>;

  // function for removing the checkout listener.
  private removeCheckoutListener = () => {};

  // sync shipping choices with checkout
  componentDidLoad() {
    if (checkoutState?.checkout?.shipping_choices?.data) this.shippingChoices = checkoutState?.checkout?.shipping_choices?.data || [];
    this.removeCheckoutListener = onChange('checkout', () => {
      this.shippingChoices = checkoutState?.checkout?.shipping_choices?.data || [];
    });
  }

  /** Remove the checkout listener when the component is destroyed. */
  disconnectedCallback() {
    this.removeCheckoutListener();
  }

  /** Can we show shipping choices. */
  canShowShippingChoices(): boolean {
    if (!checkoutState?.checkout?.shipping_choices?.pagination?.count && !!this.shippingChoices.length) {
      return true;
    }
    return checkoutState?.checkout?.shipping_enabled && checkoutState?.checkout?.selected_shipping_choice_required && !!this.shippingChoices.length;
  }

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
      this.scError.emit(e);
    } finally {
      unLockCheckout('selected_shipping_choice');
    }
  }

  render() {
    /** We shouldn't show shipping choices for this checkout. */
    if (!this.canShowShippingChoices()) {
      return null;
    }

    return (
      <Host>
        <sc-radio-group label={this.label || __('Shipping', 'surecart')} class="shipping-choices" onScChange={e => this.updateCheckout(e.detail)}>
          {(this.shippingChoices || []).map(({ id, amount, currency, shipping_method }) => (
            <sc-radio key={id} checked={checkoutState?.checkout?.selected_shipping_choice === id} class="shipping-choice" value={id}>
              <div class="shipping-choice__text">
                <div class="shipping-choice__name">{(shipping_method as ShippingMethod)?.name}</div>
                {this.showDescription && !!(shipping_method as ShippingMethod)?.description && (
                  <div class="shipping-choice__description">{(shipping_method as ShippingMethod)?.description}</div>
                )}
              </div>
              <div class="shipping-choice__price">
                <sc-format-number type="currency" value={amount} currency={currency} />
              </div>
            </sc-radio>
          ))}
        </sc-radio-group>
        {checkoutIsLocked() && <sc-block-ui></sc-block-ui>}
      </Host>
    );
  }
}
