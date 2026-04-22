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
} from '@store/processors/getters';
import { addQueryArgs } from '@wordpress/url';
import { MockProcessor } from './MockProcessor';
import { PaymentMethodType } from '../../../../types';
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

  /**
   * Combined Razorpay tile — single toggle covering all enabled methods.
   * Used for one-time checkouts (Razorpay fans methods out in its own modal) and
   * as a fallback for recurring checkouts when the API returns ≤1 method.
   *
   * NOTE: This renders ONLY the tile. The `sc-checkout-razorpay-payment-provider`
   * is rendered by callers at a stable Fragment-level position so that a flip
   * between combined → split recurring tiles doesn't reparent the provider (which
   * would trigger a disconnect-before-connect race and crash its lifecycle).
   */
  renderRazorpayCombinedTile(processor) {
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

  /**
   * Single Razorpay method choice (Card / UPI) — rendered as a direct sibling of
   * other processor choices so `sc-payment-method-choice`'s sibling-detection can
   * wire it into the `sc-toggles` group correctly.
   */
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

  renderRazorpay(processor) {
    // if system currency is not in the supported currency list, then stop.
    if (!(processor?.supported_currencies ?? []).includes(window?.scData?.currency)) {
      return;
    }

    // Only render the visible tile(s) here. The headless fetcher and the payment provider
    // are rendered at the stable `<Host>` level below so the Tag wrapper flipping between
    // `div` and `sc-toggles` (as `hasMultipleMethodChoices()` flips) can never reparent
    // them and retrigger their lifecycles.

    // One-time checkouts keep the single combined toggle — Razorpay shows all enabled
    // methods in its modal automatically.
    if (!checkoutState.checkout?.reusable_payment_method_required) {
      return this.renderRazorpayCombinedTile(processor);
    }

    // Recurring checkouts need an explicit payment_method_type (Razorpay can't auto-offer
    // all methods on recurring orders). We render one `sc-payment-method-choice` per fetched
    // method as a direct sibling of the other processors — keeping them inside this component
    // would break sibling detection and make each choice render as an always-open `div`
    // instead of a collapsible toggle.
    const methods = availableMethodTypes() || [];
    if (methods.length > 1) return methods.map(method => this.renderRazorpayMethodChoice(method));
    return this.renderRazorpayCombinedTile(processor);
  }

  /**
   * Returns the razorpay processor (if available and currency-supported) so the parent
   * `render()` can mount `sc-checkout-razorpay-payment` and `sc-checkout-razorpay-payment-provider`
   * as direct children of `<Host>`.
   *
   * Why at Host level? Both are headless (they render nothing visible). Keeping them anchored
   * to a parent that never changes is critical: `sc-checkout-razorpay-payment`'s
   * `disconnectedCallback` wipes `processorsState.methods`, which is one of the inputs to
   * the flipping `<Tag>` wrapper in this component's render. If the fetcher lives inside that
   * wrapper, a `state.methods` fill triggers `Tag: div → sc-toggles`, Stencil reparents the
   * fetcher, its disconnect wipes methods, `Tag: sc-toggles → div`, reconnects, refills,
   * reparents again — an infinite render loop that pegs a checkout lock and wedges the
   * Purchase button in the disabled state.
   */
  getRazorpayHeadlessProcessor() {
    const razorpay = getAvailableProcessor('razorpay');
    if (!razorpay) return null;
    if (!(razorpay?.supported_currencies ?? []).includes(window?.scData?.currency)) return null;
    return razorpay;
  }

  render() {
    // payment is not required for this order.
    if (checkoutState.checkout?.payment_method_required === false) {
      return null;
    }

    // Group the choices in a bordered `sc-toggles` container whenever more than one choice
    // will actually render — either multiple top-level processors/manual methods, PayPal's
    // own paypal + card fallback pair, or a method-aware processor (razorpay / mollie)
    // that is about to render multiple `sc-payment-method-choice` tiles as direct siblings.
    const Tag = hasMultipleProcessorChoices() || hasMultipleMethodChoices() || selectedProcessor?.id === 'paypal' ? 'sc-toggles' : 'div';
    const mollie = getAvailableProcessor('mollie');
    const razorpayHeadless = this.getRazorpayHeadlessProcessor();

    return (
      <Host>
        {/* Headless Razorpay components live at Host level — their parent never flips,
            so `processorsState.methods` stays populated and the Tag wrapper can freely
            change between `div` and `sc-toggles` without re-triggering their lifecycles. */}
        {razorpayHeadless && checkoutState.checkout?.reusable_payment_method_required && (
          <sc-checkout-razorpay-payment processor-id={razorpayHeadless.id} />
        )}
        {razorpayHeadless && <sc-checkout-razorpay-payment-provider />}
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
