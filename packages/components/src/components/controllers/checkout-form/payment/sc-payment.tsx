import { Component, Element, Fragment, h, Host, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { state as checkoutState } from '@store/checkout';
import { state as processorsState } from '@store/processors';
import { ManualPaymentMethods } from './ManualPaymentMethods';
import { getAvailableProcessor, hasMultipleProcessorChoices, availableManualPaymentMethods, availableProcessors } from '@store/processors/getters';

/**
 * @part base - The elements base wrapper.
 * @part form-control - The form control wrapper.
 * @part label - The input label.
 * @part help-text - Help text that describes how to use the input.
 * @part test-badge__base - Test badge base.
 * @part test-badge__content - Test badge content.
 */
@Component({
  tag: 'sc-payment',
  styleUrl: 'sc-payment.scss',
  shadow: true,
})
export class ScPayment {
  /** This element. */
  @Element() el: HTMLScPaymentElement;

  @Prop() stripePaymentElement: boolean;

  /** Disabled processor types */
  @Prop() disabledProcessorTypes: string[];

  @Prop() secureNotice: string;

  /** The input's label. */
  @Prop() label: string;

  /** Hide the test mode badge */
  @Prop() hideTestModeBadge: boolean;

  componentWillLoad() {
    processorsState.disabled.processors = this.disabledProcessorTypes;
  }

  renderStripe(processor) {
    return (
      <sc-payment-method-choice key={processor?.id} processor-id="stripe" card={this.stripePaymentElement}>
        <span slot="summary" class="sc-payment-toggle-summary">
          <sc-icon name="credit-card" style={{ fontSize: '24px' }}></sc-icon>
          <span>{__('Credit Card', 'surecart')}</span>
        </span>

        <div class="sc-payment__stripe-card-element">
          <slot name="stripe" />
        </div>
      </sc-payment-method-choice>
    );
  }

  renderPayPal(processor) {
    const stripe = getAvailableProcessor('stripe');
    return (
      <Fragment>
        {!stripe && (
          <sc-payment-method-choice key={processor?.id} processor-id="paypal" method-id="card">
            <span slot="summary" class="sc-payment-toggle-summary">
              <sc-icon name="credit-card" style={{ fontSize: '24px' }}></sc-icon>
              <span>{__('Credit Card', 'surecart')}</span>
            </span>

            <sc-card>
              <sc-payment-selected label={__('Credit Card selected for check out.', 'surecart')}>
                <sc-icon name="credit-card" slot="icon" style={{ fontSize: '24px' }}></sc-icon>
                {__('Another step will appear after submitting your order to complete your purchase details.', 'surecart')}
              </sc-payment-selected>
            </sc-card>
          </sc-payment-method-choice>
        )}

        <sc-payment-method-choice key={processor?.id} processor-id="paypal">
          <span slot="summary" class="sc-payment-toggle-summary">
            <sc-icon name="paypal" style={{ width: '80px', fontSize: '24px' }}></sc-icon>
          </span>

          <sc-card>
            <sc-payment-selected label={__('PayPal selected for check out.', 'surecart')}>
              <sc-icon slot="icon" name="paypal" style={{ width: '80px' }}></sc-icon>
              {__('Another step will appear after submitting your order to complete your purchase details.', 'surecart')}
            </sc-payment-selected>
          </sc-card>
        </sc-payment-method-choice>
      </Fragment>
    );
  }

  render() {
    // payment is not required for this order.
    if (checkoutState.checkout?.payment_method_required === false) {
      return null;
    }

    const Tag = hasMultipleProcessorChoices() ? 'sc-toggles' : 'div';
    const mollie = getAvailableProcessor('mollie');

    return (
      <Host>
        <sc-form-control label={this.label} exportparts="label, help-text, form-control">
          <div class="sc-payment-label" slot="label">
            <div>{this.label}</div>
            {checkoutState.mode === 'test' && !this.hideTestModeBadge && (
              <sc-tag type="warning" size="small" exportparts="base:test-badge__base, content:test-badge__content">
                {__('Test Mode', 'surecart')}
              </sc-tag>
            )}
          </div>

          {mollie?.id ? (
            <sc-checkout-mollie-payment processor-id={mollie?.id}></sc-checkout-mollie-payment>
          ) : (
            <Tag collapsible={false} theme="container">
              {!availableProcessors()?.length && (
                <sc-alert type="info" open>
                  {__('You do not have any processors enabled for this mode and cart. Please configure your processors.', 'surecart')}
                </sc-alert>
              )}
              {(availableProcessors() || []).map(processor => {
                switch (processor?.processor_type) {
                  case 'stripe':
                    return this.renderStripe(processor);
                  case 'paypal':
                    return this.renderPayPal(processor);
                }
              })}
              <ManualPaymentMethods methods={availableManualPaymentMethods()} />
            </Tag>
          )}
        </sc-form-control>
      </Host>
    );
  }
}
