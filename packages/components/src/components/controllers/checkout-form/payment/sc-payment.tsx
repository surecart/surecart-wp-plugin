import { Component, Element, Fragment, h, Host, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { state as checkoutState } from '@store/checkout';
import { state as processorsState } from '@store/processors';
import { state as selectedProcessor } from '@store/selected-processor';
import { ManualPaymentMethods } from './ManualPaymentMethods';
import {
  getAvailableProcessor,
  hasMultipleProcessorChoices,
  availableManualPaymentMethods,
  availableProcessors,
  hasOtherAvailableCreditCardProcessor,
} from '@store/processors/getters';
import { addQueryArgs } from '@wordpress/url';
import { MockProcessor } from './MockProcessor';

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
    processorsState.disabled = {
      ...processorsState.disabled,
      processors: this.disabledProcessorTypes
  };
  }

  renderStripe(processor) {
    const title = hasOtherAvailableCreditCardProcessor('stripe') ? __('Credit Card (Stripe)', 'surecart') : __('Credit Card', 'surecart');
    return (
      <sc-payment-method-choice key={processor?.id} processor-id="stripe" card={this.stripePaymentElement}>
        <span slot="summary" class="sc-payment-toggle-summary">
          <sc-icon name="credit-card" style={{ fontSize: '24px' }} aria-hidden="true"></sc-icon>
          <span>{title}</span>
        </span>

        <div class="sc-payment__stripe-card-element">
          <slot name="stripe" />
        </div>
      </sc-payment-method-choice>
    );
  }

  renderPayPal(processor) {
    return (
      <Fragment>
        <sc-payment-method-choice key={processor?.id} processor-id="paypal">
          <span slot="summary" class="sc-payment-toggle-summary">
            <sc-icon name="paypal" style={{ width: '80px', fontSize: '24px' }} aria-hidden="true"></sc-icon>
            <sc-visually-hidden>{__('PayPal', 'surecart')}</sc-visually-hidden>
          </span>

          <sc-card>
            <sc-payment-selected label={__('PayPal selected for check out.', 'surecart')}>
              <sc-icon slot="icon" name="paypal" style={{ width: '80px' }} aria-hidden="true"></sc-icon>
              {__('Another step will appear after submitting your order to complete your purchase details.', 'surecart')}
            </sc-payment-selected>
          </sc-card>
        </sc-payment-method-choice>
        {!hasOtherAvailableCreditCardProcessor('paypal') && (
          <sc-payment-method-choice key={processor?.id} processor-id="paypal" method-id="card">
            <span slot="summary" class="sc-payment-toggle-summary">
              <sc-icon name="credit-card" style={{ fontSize: '24px' }} aria-hidden="true"></sc-icon>
              <span>{__('Credit Card', 'surecart')}</span>
            </span>

            <sc-card>
              <sc-payment-selected label={__('Credit Card selected for check out.', 'surecart')}>
                <sc-icon name="credit-card" slot="icon" style={{ fontSize: '24px' }} aria-hidden="true"></sc-icon>
                {__('Another step will appear after submitting your order to complete your purchase details.', 'surecart')}
              </sc-payment-selected>
            </sc-card>
          </sc-payment-method-choice>
        )}
      </Fragment>
    );
  }

  renderMock(processor) {
    return <MockProcessor processor={processor} />;
  }

  renderPaystack(processor) {
    const title = hasOtherAvailableCreditCardProcessor('paystack') ? __('Credit Card (Paystack)', 'surecart') : __('Credit Card', 'surecart');

    // if system currency is not in the supported currency list, then stop.
    if (!(processor?.supported_currencies ?? []).includes(window?.scData?.currency)) {
      return;
    }

    return (
      <sc-payment-method-choice key={processor?.id} processor-id="paystack">
        <span slot="summary" class="sc-payment-toggle-summary">
          <sc-icon name="credit-card" style={{ fontSize: '24px' }} aria-hidden="true"></sc-icon>
          <span>{title}</span>
        </span>

        <sc-card>
          <sc-payment-selected label={__('Credit Card selected for check out.', 'surecart')}>
            <sc-icon slot="icon" name="credit-card" aria-hidden="true"></sc-icon>
            {__('Another step will appear after submitting your order to complete your purchase details.', 'surecart')}
          </sc-payment-selected>
        </sc-card>
        <sc-checkout-paystack-payment-provider />
      </sc-payment-method-choice>
    );
  }

  render() {
    // payment is not required for this order.
    if (checkoutState.checkout?.payment_method_required === false) {
      return null;
    }

    const Tag = hasMultipleProcessorChoices() || selectedProcessor?.id === 'paypal' ? 'sc-toggles' : 'div';
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
              {!availableProcessors()?.length && !availableManualPaymentMethods()?.length && (
                <sc-alert type="info" open>
                  {window?.scData?.user_permissions?.manage_sc_shop_settings ? (
                    <Fragment>
                      {__('You do not have any processors enabled for this mode and cart. ', 'surecart')}
                      <a
                        href={addQueryArgs(`${window?.scData?.admin_url}admin.php`, {
                          page: 'sc-settings',
                          tab: 'processors',
                        })}
                        style={{ color: 'var(--sc-color-gray-700)' }}
                      >
                        {__('Please configure your processors', 'surecart')}
                      </a>
                      .
                    </Fragment>
                  ) : (
                    __('Please contact us for payment.', 'surecart')
                  )}
                </sc-alert>
              )}
              {(availableProcessors() || []).map(processor => {
                switch (processor?.processor_type) {
                  case 'stripe':
                    return this.renderStripe(processor);
                  case 'paypal':
                    return this.renderPayPal(processor);
                  case 'paystack':
                    return this.renderPaystack(processor);
                  case 'mock':
                    return this.renderMock(processor);
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
