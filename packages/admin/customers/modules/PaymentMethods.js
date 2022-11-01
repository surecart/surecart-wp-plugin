import { ScButton, ScTag } from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __, _n } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import DataTable from '../../components/DataTable';

export default ({ customerId }) => {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);

	const { paymentMethods, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'payment_method',
				{
					customer_ids: [customerId],
					expand: ['card', 'customer', 'billing_agreement', 'paypal_account', 'payment_instrument', 'bank_account'],
					page,
					per_page: perPage,
				},
			];
			const paymentMethods = select(coreStore).getEntityRecords(...queryArgs);
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);
			return {
				paymentMethods,
				loading: loading && page === 1,
			};
		},
		[customerId, page, perPage]
	);

  const setDefault = async (id) => {
    try {
      loading = true;
      await apiFetch({
        path: `surecart/v1/customers/${customerId}`,
        method: 'PATCH',
        data: {
          default_payment_method: method.id,
        },
      });
      paymentMethods = (await apiFetch({
        path: addQueryArgs(`surecart/v1/payment_methods/`, {
          expand: ['card', 'customer', 'billing_agreement', 'paypal_account', 'payment_instrument', 'bank_account']
        }),
      }));
    } catch (e) {
      alert(e?.messsage || __('Something went wrong', 'surecart'));
    } finally {
      loading = false;
    }
  }

  console.log(paymentMethods);

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
