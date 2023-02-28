import { FunctionalComponent, h } from '@stencil/core';
import { sprintf, __ } from '@wordpress/i18n';
import { ManualPaymentMethod } from '../../../../types';

export const ManualPaymentMethods: FunctionalComponent<{ methods: ManualPaymentMethod[] }> = ({ methods }) =>
  (methods || []).map(method => (
    <sc-payment-method-choice is-manual processor-id={method?.id}>
      <span slot="summary">{method?.name}</span>
      <sc-card>
        <sc-payment-selected
          label={sprintf(
            // translators: Manual payment method.
            __('%s selected for check out.', 'surecart'),
            method?.name,
          )}
        >
          {method?.description}
        </sc-payment-selected>
      </sc-card>
    </sc-payment-method-choice>
  ));
