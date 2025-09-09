import { Component, Fragment, h, Prop } from '@stencil/core';
import { checkoutIsLocked } from '@store/checkout/getters';
import { availableProcessors } from '@store/processors/getters';
import { state as selectedProcessor } from '@store/selected-processor';
import { state as checkoutState } from '@store/checkout';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

import { getProcessorData } from '../../../../functions/processor';
import { Checkout, Processor, ProcessorName } from '../../../../types';
import { formBusy } from '@store/form/getters';

@Component({
  tag: 'sc-order-submit',
  styleUrl: 'sc-order-submit.scss',
  shadow: false,
})
export class ScOrderSubmit {
  /** Is the order loading. */
  @Prop() loading: boolean;

  /** Is the order paying. */
  @Prop() paying: boolean;

  /** The button type. */
  @Prop({ reflect: true }) type: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'text' | 'link' = 'primary';

  /** The button's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Show a full-width button. */
  @Prop() full: boolean = true;

  /** Icon to show. */
  @Prop() icon: string;

  /** Show the total. */
  @Prop() showTotal: boolean;

  /** Keys and secrets for processors. */
  @Prop() processors: Processor[];

  /** The current order. */
  @Prop() order: Checkout;

  /** Currency Code */
  @Prop() currencyCode: string = 'usd';

  /** The selected processor. */
  @Prop() processor: ProcessorName;

  /** Secure */
  @Prop() secureNoticeText: string;

  /** Show the secure notice */
  @Prop() secureNotice: boolean = true;

  cannotShipToLocation() {
    return checkoutState?.checkout?.selected_shipping_choice_required && !checkoutState.checkout?.selected_shipping_choice;
  }

  renderPayPalButton(buttons) {
    const { client_id, account_id, merchant_initiated_enabled } = getProcessorData(availableProcessors(), 'paypal', checkoutState.mode);
    if (!client_id && !account_id) return null;

    return (
      <sc-paypal-buttons
        buttons={buttons}
        busy={formBusy() || checkoutIsLocked()}
        mode={checkoutState.mode}
        order={checkoutState.checkout}
        merchantInitiated={merchant_initiated_enabled}
        currency-code={checkoutState.currencyCode}
        client-id={client_id}
        merchant-id={account_id}
        label="checkout"
        color="blue"
      ></sc-paypal-buttons>
    );
  }

  render() {
    if (this.cannotShipToLocation() || checkoutIsLocked('OUT_OF_STOCK')) {
      return (
        <sc-button type={this.type} size={this.size} full={this.full} loading={this.loading || this.paying} disabled={true}>
          {!!this.icon && <sc-icon name={this.icon} slot="prefix" aria-hidden="true"></sc-icon>}
          <slot>{__('Purchase', 'surecart')}</slot>
          {this.showTotal && (
            <span>
              {'\u00A0'}
              <sc-total></sc-total>
            </span>
          )}
          <sc-visually-hidden> {__('Press enter to purchase', 'surecart')}</sc-visually-hidden>
        </sc-button>
      );
    }

    const paymentRequired = checkoutState.checkout?.payment_method_required;

    return (
      <Fragment>
        {paymentRequired && selectedProcessor.id === 'paypal' && !selectedProcessor?.method && this.renderPayPalButton(['paypal'])}
        {paymentRequired && selectedProcessor.id === 'paypal' && selectedProcessor?.method === 'card' && this.renderPayPalButton(['card'])}
        <sc-button
          hidden={['paypal', 'paypal-card'].includes(selectedProcessor.id) && paymentRequired}
          submit
          type={this.type}
          size={this.size}
          full={this.full}
          loading={this.loading || this.paying}
          disabled={this.loading || this.paying || formBusy() || checkoutIsLocked() || this.cannotShipToLocation()}
        >
          {!!this.icon && <sc-icon name={this.icon} slot="prefix" aria-hidden="true"></sc-icon>}
          <slot>{__('Purchase', 'surecart')}</slot>
          {this.showTotal && (
            <span>
              {'\u00A0'}
              <sc-total></sc-total>
            </span>
          )}
          <sc-visually-hidden> {__('Press enter to purchase', 'surecart')}</sc-visually-hidden>
        </sc-button>
        {this.secureNotice && location.protocol === 'https:' && (
          <div class="sc-secure-notice">
            <sc-secure-notice>{this.secureNoticeText || __('This is a secure, encrypted payment.', 'surecart')}</sc-secure-notice>
          </div>
        )}
      </Fragment>
    );
  }
}
openWormhole(ScOrderSubmit, ['loading', 'paying', 'processors', 'processor', 'currencyCode', 'order'], false);
