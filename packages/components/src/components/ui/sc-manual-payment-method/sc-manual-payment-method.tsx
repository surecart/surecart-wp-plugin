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
  @Prop() showDescription: boolean = false;

  render() {
    return (
      <div class="manual-payment-method" part="card">
        <div class="payment-method__title">{this.paymentMethod?.name}</div>
        {this.showDescription && <sc-prose class="payment-method__description" innerHTML={this.paymentMethod?.description} />}
      </div>
    );
  }
}
