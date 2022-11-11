import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';
import { Checkout, Processor } from '../../../../types';

@Component({
  tag: 'sc-payment',
  styleUrl: 'sc-payment.scss',
  shadow: true,
})
export class ScPayment {
  private paymentChoices: HTMLScPaymentMethodChoiceElement[] = [];

  /** This element. */
  @Element() el: HTMLScPaymentElement;

  /** The current selected processor. */
  @Prop() processor: string;

  /** List of available processors. */
  @Prop() processors: Processor[] = [];

  /** Checkout Session from sc-checkout. */
  @Prop() checkout: Checkout;

  /** Is this created in "test" mode */
  @Prop() mode: 'test' | 'live' = 'live';

  /** The input's label. */
  @Prop() label: string;

  /** Hide the test mode badge */
  @Prop() hideTestModeBadge: boolean;

  /** Does this have multiple choices */
  @State() hasMultiple: boolean;

  /** Set the checkout procesor. */
  @Event() scSetProcessor: EventEmitter<{ id: string; manual: boolean } | null>;

  private mutationObserver: MutationObserver;

  getAllProcessors() {
    return Array.from(this.el.querySelectorAll('sc-payment-method-choice') as NodeListOf<HTMLScPaymentMethodChoiceElement>) || null;
  }

  /** Handle processor invalid state. */
  @Listen('scProcessorInvalid')
  selectFirstProcessor() {
    // set the first processor that is showing and set that one.
    // use settimeout to wait for display:none rendering to finish.
    setTimeout(() => {
      const processor = (this.el.querySelector('sc-payment-method-choice:not([style*="display: none"])') as HTMLScPaymentMethodChoiceElement) || null;
      if (processor?.processorId) {
        this.scSetProcessor.emit({ id: processor?.processorId, manual: processor.isManual });
      }
    }, 50);
  }

  componentDidLoad() {
    this.checkMethodsNumber();
    this.selectFirstProcessor();
    this.mutationObserver = new MutationObserver(() => this.checkMethodsNumber());
    this.mutationObserver.observe(this.el, { attributes: true, childList: true, subtree: false });
  }

  disconnectedCallback() {
    this.mutationObserver.disconnect();
  }

  checkMethodsNumber() {
    this.paymentChoices = this.getAllProcessors();
    const active = this.paymentChoices.filter(choice => !choice?.isDisabled);
    this.hasMultiple = active?.length > 1;
    this.paymentChoices.forEach(choice => {
      choice.hasOthers = this?.hasMultiple;
    });
  }

  render() {
    // payment is not required for this order.
    if (this.checkout?.payment_method_required === false) {
      return null;
    }

    const Tag = this.hasMultiple ? 'sc-toggles' : 'div';

    return (
      <Host>
        <sc-form-control label={this.label}>
          <div class="sc-payment-label" slot="label">
            <div>{this.label}</div>
            {this.mode === 'test' && !this.hideTestModeBadge && (
              <sc-tag type="warning" size="small">
                {__('Test Mode', 'surecart')}
              </sc-tag>
            )}
          </div>
          <Tag collapsible={false} theme="container">
            <slot>
              <sc-alert type="info" open>
                {__('Please contact us for payment', 'surecart')}
              </sc-alert>
            </slot>
          </Tag>
        </sc-form-control>
      </Host>
    );
  }
}

openWormhole(ScPayment, ['processor', 'processors', 'checkout', 'mode'], false);
