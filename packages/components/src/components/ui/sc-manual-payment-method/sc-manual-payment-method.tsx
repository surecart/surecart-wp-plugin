import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

import { ManualPaymentMethod } from '../../../types';

@Component({
  tag: 'sc-manual-payment-method',
  styleUrl: 'sc-manual-payment-method.css',
  shadow: true,
})
export class ScManualPaymentMethod {
  @Prop() paymentMethod: ManualPaymentMethod;

  render() {
      return (
        <div class="payment-method" part="card">
          <sc-text style={{ whiteSpace: 'nowrap', paddingRight: '6px', fontStyle: 'bold' }}>{this.paymentMethod?.name}</sc-text>
          <sc-text style={{ whiteSpace: 'nowrap', paddingRight: '6px', fontStyle: 'italic' }}>{this.paymentMethod?.description}</sc-text>
        </div>
      );
  }
}
