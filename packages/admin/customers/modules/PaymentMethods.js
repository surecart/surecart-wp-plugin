import { ScButton, ScTag } from '@surecart/components-react';
import { useEffect, useState } from '@wordpress/element';
import { __, _n } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';
import DataTable from '../../components/DataTable';

export default ({ customerId }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
	const [state, setState] = useState(true);

  useEffect(()=>{
    setLoading(true);
    const payment = async () => {
      const data = await apiFetch({
        path: addQueryArgs(`surecart/v1/payment_methods/`, {
          expand: ['card', 'customer', 'billing_agreement', 'paypal_account', 'payment_instrument', 'bank_account'],
          customer_ids: [customerId]
        }),
      });
      setPaymentMethods(data);
      setLoading(false);
    }
    payment();
  }, [state]);

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
      alert(e?.messsage || __('Something went wrong', 'surecart'));
      console.log(e);
    } finally {
      setLoading(false);
      setState(!state);
    }
  }

	return (
		<>
      <DataTable
        title={__('Payment Methods', 'surecart')}
        empty={__('None found.', 'surecart')}
        loading={loading}
        columns={{
          icon: {
            label: __('Icon', 'surecart'),
          },
          number: {
            label: __('Number', 'surecart'),
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
            icon: (
              <sc-cc-logo
                style={{ fontSize: '36px' }}
                brand={item?.card?.brand}
              ></sc-cc-logo>
            ),
            number: (
              '**** ' + item?.card?.last4
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
