import { Component, Prop, h,EventEmitter, Event } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { state as checkoutState, onChange } from '@store/checkout';
import { Checkout, ResponseError, ShippingChoice, ShippingMethod } from '../../../types';
import { lockCheckout, unLockCheckout } from '@store/checkout/mutations';
import { createOrUpdateCheckout } from '@services/session';

@Component({
  tag: 'sc-shipping-choices',
  styleUrl: 'sc-shipping-choices.scss',
  shadow: true,
})
export class ScShippingChoices {
  /** The shipping section label */
  @Prop() label: string;

  /** Show control on shipping option */
  @Prop() showControl: boolean = true;

  /** Whether to show the shipping choice description */
  @Prop() showDescription: boolean = true;

  /** Shipping choices */
  @Prop({ mutable: true }) shippingChoices: ShippingChoice[] = [];

  /** Error event */
  @Event() scError: EventEmitter<ResponseError>;

  componentDidLoad() {
    if (checkoutState?.checkout?.shipping_choices?.data) this.shippingChoices = checkoutState?.checkout?.shipping_choices?.data || [];

    onChange('checkout', () => {
      this.shippingChoices = checkoutState?.checkout?.shipping_choices?.data || [];
    });
  }

  canShowShippingChoices(): boolean {
    // are we on test mode
    if(!checkoutState?.checkout?.shipping_choices?.pagination?.count && !!this.shippingChoices.length ){
      return true;
    }

    return checkoutState?.checkout?.shipping_enabled && checkoutState?.checkout?.selected_shipping_choice_required && !!this.shippingChoices.length;
  }

  async maybeUpdateOrder(selectedShippingChoiceId: string) {
    try {
      lockCheckout('selected_shipping_choice');
      checkoutState.checkout = (await createOrUpdateCheckout({
        id: checkoutState.checkout.id,
        data: {
          selected_shipping_choice_id: selectedShippingChoiceId
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
    if (!this.canShowShippingChoices()) {
      return null;
    }

    return (
      <sc-form-control label={this.label || __('Shipping', 'surecart')}>
        <sc-flex flexDirection="column" style={{ '--sc-flex-column-gap': 'var(--sc-spacing-small)' }}>
          {(this.shippingChoices || []).map(({ id, amount, currency, shipping_method }) => (
            <sc-choice-container
              showControl={this.showControl}
              checked={checkoutState?.checkout?.selected_shipping_choice === id}
              onScChange={(checked) => checked && this.maybeUpdateOrder(id)  }
            >
              <div class="shipping-choice">
                <sc-flex flexDirection="column" style={{ '--sc-flex-column-gap': 'var(--sc-spacing-xx-small)' }}>
                  <div class="shipping-choice__name">{(shipping_method as ShippingMethod)?.name}</div>
                  {this.showDescription && !!(shipping_method as ShippingMethod)?.description && (
                    <div class="shipping-choice__description">{(shipping_method as ShippingMethod)?.description}</div>
                  )}
                </sc-flex>
                <div class="shipping-choice__price">
                  <sc-format-number type="currency" value={amount} currency={currency} />
                </div>
              </div>
            </sc-choice-container>
          ))}
        </sc-flex>
      </sc-form-control>
    );
  }
}
