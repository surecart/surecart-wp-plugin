import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';
import { Checkout, Processor } from '../../../../types';

@Component({
  tag: 'sc-payment',
  styleUrl: 'sc-payment.scss',
  shadow: true,
})
export class ScPayment {
  /** This element. */
  @Element() el: HTMLScPaymentElement;

  /** The current selected processor. */
  @Prop() processor: string;

  /** List of available processors. */
  @Prop() processors: Processor[] = [];

  /** Checkout Session from sc-checkout. */
  @Prop() order: Checkout;

  /** Is this created in "test" mode */
  @Prop() mode: 'test' | 'live' = 'live';

  /** The input's label. */
  @Prop() label: string;

  /** Hide the test mode badge */
  @Prop() hideTestModeBadge: boolean;

  /** Set the order procesor. */
  @Event() scSetProcessor: EventEmitter<string | null>;

  /** Handle processor invalid state. */
  @Listen('scProcessorInvalid')
  handleInvalidProcessor() {
    // set the first processor that is showing and set that one.
    // use settimeout to wait for display:none rendering to finish.
    setTimeout(() => {
      const processor = (this.el.querySelector('sc-payment-method-choice:not([style*="display: none"])') as HTMLScPaymentMethodChoiceElement)?.processorId || null;
      this.scSetProcessor.emit(processor);
    }, 50);
  }

  render() {
    return (
      <Host>
        {/* Handles the automatic filtering and selection of processors */}
        <sc-processor-provider checkout={this.order} processors={this.processors} processor={this.processor} />
        <sc-form-control label={this.label}>
          <div class="sc-payment-label" slot="label">
            <div>{this.label}</div>
            {this.mode === 'test' && !this.hideTestModeBadge && (
              <sc-tag type="warning" size="small">
                {__('Test Mode', 'surecart')}
              </sc-tag>
            )}
          </div>
          <sc-toggles collapsible={false} theme="container">
            <slot>
              <sc-alert type="info" open>
                {__('Please contact us for payment', 'surecart')}
              </sc-alert>
            </slot>
          </sc-toggles>
        </sc-form-control>
      </Host>
    );
  }
}

openWormhole(ScPayment, ['processor', 'processors', 'order', 'mode'], false);
