import { ScButton, ScFormatNumber } from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __, _n } from '@wordpress/i18n';
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
            width: '150px',
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
							<ScButton size="small">
								{__('View', 'surecart')}
							</ScButton>
						),
          }
        })}
      />
      {/* {console.log(paymentMethods)} */}
    </>
	);
};
