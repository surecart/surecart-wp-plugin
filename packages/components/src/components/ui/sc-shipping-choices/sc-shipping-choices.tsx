import { Component, Prop, h, EventEmitter, Event,State } from '@stencil/core';
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

  /** Whether to show the shipping choice description */
  @Prop() showDescription: boolean = true;

  /** Shipping choices */
  @Prop({ mutable: true }) shippingChoices: ShippingChoice[] = [];

  /** Error event */
  @Event() scError: EventEmitter<ResponseError>;

  @State() busy:boolean = false;

  componentDidLoad() {
    if (checkoutState?.checkout?.shipping_choices?.data) this.shippingChoices = checkoutState?.checkout?.shipping_choices?.data || [];

    onChange('checkout', () => {
      this.shippingChoices = checkoutState?.checkout?.shipping_choices?.data || [];
    });
  }

  canShowShippingChoices(): boolean {
    // are we on test mode
    if (!checkoutState?.checkout?.shipping_choices?.pagination?.count && !!this.shippingChoices.length) {
      return true;
    }

    return checkoutState?.checkout?.shipping_enabled && checkoutState?.checkout?.selected_shipping_choice_required && !!this.shippingChoices.length;
  }

  async maybeUpdateOrder(selectedShippingChoiceId: string) {
    try {
      this.busy = true;
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
      this.busy = false;
    }
  }

  render() {
    if (!this.canShowShippingChoices()) {
      return null;
    }

    return (
      <sc-form-control label={this.label || __('Shipping', 'surecart')} style={{'position':'relative'}}>
        <sc-radio-group>
          {(this.shippingChoices || []).map(({ id, amount, currency, shipping_method }) => (
            <sc-radio
              key={id}
              checked={checkoutState?.checkout?.selected_shipping_choice === id}
              class="shipping-choice"
              value={id}
              onClick={()=>{
                this.maybeUpdateOrder(id);
              }}
            >
              <sc-flex flexDirection="column" style={{ '--sc-flex-column-gap': 'var(--sc-spacing-xx-small)' }}>
                <div class="shipping-choice__name">{(shipping_method as ShippingMethod)?.name}</div>
                {this.showDescription && !!(shipping_method as ShippingMethod)?.description && (
                  <div class="shipping-choice__description">{(shipping_method as ShippingMethod)?.description}</div>
                )}
              </sc-flex>
              <div class="shipping-choice__price">
                <sc-format-number type="currency" value={amount} currency={currency} />
              </div>
            </sc-radio>
          ))}
        </sc-radio-group>
        {
          this.busy && <sc-block-ui></sc-block-ui>
        }
      </sc-form-control>
    );
  }
}
