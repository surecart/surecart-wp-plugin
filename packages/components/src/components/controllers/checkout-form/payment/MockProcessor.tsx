import { FunctionalComponent, h } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Processor } from '../../../../types';

export const MockProcessor: FunctionalComponent<{ processor: Processor }> = ({ processor }) => {
  if (!processor?.id) {
    return null;
  }
  return (
    <sc-payment-method-choice key={processor?.id} processor-id="mock">
      <span slot="summary" class="sc-payment-toggle-summary">
        <sc-icon name="credit-card" style={{ fontSize: '24px' }} aria-hidden="true"></sc-icon>
        <span>{__('Test Processor', 'surecart')}</span>
      </span>

      <sc-card>
        <sc-payment-selected label={__('Test processor selected for check out.', 'surecart')}>
          <sc-icon slot="icon" name="credit-card" aria-hidden="true"></sc-icon>
          {__('This is a test payment processor used to simulate test transactions. It is only available in test mode.', 'surecart')}
        </sc-payment-selected>
      </sc-card>
      <sc-checkout-paystack-payment-provider />
    </sc-payment-method-choice>
  );
};
