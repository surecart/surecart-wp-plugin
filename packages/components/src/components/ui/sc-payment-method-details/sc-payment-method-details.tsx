import { Component, h, Prop } from '@stencil/core';
import { __, sprintf } from '@wordpress/i18n';
import { PaymentMethod } from '../../../types';

@Component({
  tag: 'sc-payment-method-details',
  shadow: true,
})
export class ScPaymentMethodDetails {
  @Prop() paymentMethod: PaymentMethod;
  @Prop() editHandler: () => void;

  render() {
    return (
      <sc-card>
        <sc-flex alignItems="center" justifyContent="flex-start" style={{ gap: '0.5em' }}>
          <sc-payment-method paymentMethod={this.paymentMethod} />
          <div>
            {!!this.paymentMethod?.card?.exp_month && (
              <span>
                {
                  // Translators: %d/%d is month and year of expiration.
                  sprintf(__('Exp. %d/%d', 'surecart'), this.paymentMethod?.card?.exp_month, this.paymentMethod?.card?.exp_year)
                }
              </span>
            )}
            {!!this.paymentMethod?.paypal_account?.email && this.paymentMethod?.paypal_account?.email}
          </div>
          <sc-button type="text" circle onClick={this.editHandler}>
            <sc-icon name="edit-2" />
          </sc-button>
        </sc-flex>
      </sc-card>
    );
  }
}
