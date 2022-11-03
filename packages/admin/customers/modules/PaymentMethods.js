import { ScButton, ScPaymentMethod, ScTag } from '@surecart/components-react';
import { useEffect, useState } from '@wordpress/element';
import { __, _n } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';
import DataTable from '../../components/DataTable';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';

export default ({ customerId }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { createSuccessNotice, createErrorNotice } = useDispatch(noticesStore);

  const payment = async () => {
    try {
      setLoading(true);
      const data = await apiFetch({
        path: addQueryArgs(`surecart/v1/payment_methods/`, {
          expand: ['card', 'customer', 'billing_agreement', 'paypal_account', 'payment_instrument', 'bank_account'],
          customer_ids: [customerId]
        }),
      });
      setPaymentMethods(data);
    } catch(e) {
      createErrorNotice(e?.message || __('Something went wrong', 'surecart'), {type: 'snackbar'});
    } finally {
      setLoading(false);
    }
  }

  const setDefault = async (id) => {
    try {
      setLoading(true);
      await apiFetch({
        path: `surecart/v1/customers/${customerId}`,
        method: 'PATCH',
        data: {
          default_payment_method: id,
        },
      });
    } catch (e) {
      createErrorNotice(e?.message || __('Something went wrong', 'surecart'), {type: 'snackbar'});
    } finally {
      payment();
      createSuccessNotice(__('Default payment method changed', 'surecart'), {type: 'snackbar'});
      setLoading(false);
    }
  }

  useEffect(() => {
    payment();
  }, [])

	return (
		<>
      <DataTable
        title={__('Payment Methods', 'surecart')}
        empty={__('None found.', 'surecart')}
        loading={loading}
        columns={{
          method: {
            label: __('Method', 'surecart'),
          },
          exp: {
            label: __('Exp', 'surecart'),
          },
          action: {
            label: __('Status', 'surecart'),
          },
        }}
        items={paymentMethods?.map((item)=>{
          return {
            method: (
              <ScPaymentMethod paymentMethod={item} />
            ),
            exp: (
              item?.card?.exp_month + '/' + item?.card?.exp_year
            ),
            action: (
                item?.id !== item?.customer?.default_payment_method ? (
                  <ScButton size='small' type='default' onClick={() => setDefault(item?.id)}>
                    {__('Make Default', 'surecart')}
                  </ScButton>
                ) : (
                  <ScTag type='info'>Default</ScTag>
                )
						),
          }
        })}
      />
    </>
	);
};
