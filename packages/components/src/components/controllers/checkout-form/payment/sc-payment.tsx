import { Component, Element, Fragment, h, Host, Prop } from '@stencil/core';
import { __, sprintf } from '@wordpress/i18n';
import { state as checkoutState } from '@store/checkout';
import { state as processorsState } from '@store/processors';
import { state as selectedProcessor } from '@store/selected-processor';
import { ManualPaymentMethods } from './ManualPaymentMethods';
import {
  getAvailableProcessor,
  hasMultipleProcessorChoices,
  hasMultipleMethodChoices,
  availableManualPaymentMethods,
  availableMethodTypes,
  availableProcessors,
  hasOtherAvailableCreditCardProcessor,
  processorSupportsCurrentCurrency,
} from '@store/processors/getters';
import { addQueryArgs } from '@wordpress/url';
import { MockProcessor } from './MockProcessor';
import { PaymentMethodType, Processor } from '../../../../types';
import { getRazorpayMethodIcon, getRazorpayMethodLabel } from '../../../../functions/razorpay';

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
      processors: this.disabledProcessorTypes,
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

  renderMock(processor: Processor) {
    return <MockProcessor processor={processor} />;
  }

  renderPaystack(processor: Processor) {
    const title = hasOtherAvailableCreditCardProcessor('paystack') ? __('Credit Card (Paystack)', 'surecart') : __('Credit Card', 'surecart');

    if (!processorSupportsCurrentCurrency(processor)) return;

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

  /** Combined Razorpay — Razorpay's modal fans out all enabled methods itself. */
  renderRazorpayCombined(processor: Processor) {
    return (
      <sc-payment-method-choice key={processor?.id} processor-id="razorpay">
        <span slot="summary" class="sc-payment-toggle-summary">
          <sc-icon name="razorpay" style={{ fontSize: '24px' }} aria-hidden="true"></sc-icon>
          <span>{__('Cards, Netbanking, Wallet & UPI', 'surecart')}</span>
        </span>

        <sc-card>
          <sc-payment-selected label={__('Cards, Netbanking, Wallet & UPI selected for check out.', 'surecart')}>
            <sc-icon slot="icon" name="razorpay" aria-hidden="true"></sc-icon>
            {__('Another step will appear after submitting your order to complete your purchase details.', 'surecart')}
          </sc-payment-selected>
        </sc-card>
      </sc-payment-method-choice>
    );
  }

  /** Per-method Razorpay tile. Rendered as a sibling so `sc-payment-method-choice` can wire it into `sc-toggles`. */
  renderRazorpayMethodChoice(method: PaymentMethodType) {
    const label = getRazorpayMethodLabel(method.id) ?? method.id;
    const icon = getRazorpayMethodIcon(method.id);

    return (
      <sc-payment-method-choice key={`razorpay-${method.id}`} processor-id="razorpay" method-id={method.id}>
        <span slot="summary" class="sc-payment-toggle-summary">
          <sc-icon name={icon} style={{ fontSize: '24px' }} aria-hidden="true"></sc-icon>
          <span>{label}</span>
        </span>

        <sc-card>
          <sc-payment-selected label={sprintf(__('%s selected for check out.', 'surecart'), label)}>
            <sc-icon slot="icon" name={icon} aria-hidden="true"></sc-icon>
            {__('Another step will appear after submitting your order to complete your purchase details.', 'surecart')}
          </sc-payment-selected>
        </sc-card>
      </sc-payment-method-choice>
    );
  }

  /**
   * Split into per-method tiles only on recurring checkouts with ≥2 enabled methods —
   * Razorpay's recurring API requires an explicit `payment_method_type`, while the
   * one-time modal fans all methods out itself.
   */
  shouldSplitRazorpayMethods(): boolean {
    return !!checkoutState.checkout?.reusable_payment_method_required && (availableMethodTypes() || []).length > 1;
  }

  renderRazorpay(processor: Processor) {
    if (!processorSupportsCurrentCurrency(processor)) return;

    if (this.shouldSplitRazorpayMethods()) {
      return (availableMethodTypes() || []).map(method => this.renderRazorpayMethodChoice(method));
    }
    return this.renderRazorpayCombined(processor);
  }

  render() {
    // payment is not required for this order.
    if (checkoutState.checkout?.payment_method_required === false) {
      return null;
    }

    // `sc-toggles` wrapper when >1 choice will render (processors, paypal's card fallback, or per-method tiles).
    const Tag = hasMultipleProcessorChoices() || hasMultipleMethodChoices() || selectedProcessor?.id === 'paypal' ? 'sc-toggles' : 'div';
    const mollie = getAvailableProcessor('mollie');
    const razorpay = getAvailableProcessor('razorpay');

    return (
      <Host>
        {/* Mounted at Host level so the provider isn't reparented when its own `processorsState.methods` write flips the `Tag` wrapper. */}
        {processorSupportsCurrentCurrency(razorpay) && <sc-checkout-razorpay-payment-provider processor-id={razorpay.id} />}
        <sc-form-control label={this.label} exportparts="label, help-text, form-control">
          <div class="sc-payment-label" slot="label">
            <div>{this.label}</div>
            <slot name="label-end" />
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
                  case 'razorpay':
                    return this.renderRazorpay(processor);
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
