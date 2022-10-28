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
				'order',
				{
					context: 'edit',
					customer_ids: [customerId],
					expand: ['checkout', 'checkout.line_items'],
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

  // Test data
  const data = [
    {
      "id": "1",
      "icon": "visa",
      "number": "VISA 1234",
      "expDate": "12/2023",
    },
    {
      "id": "2",
      "icon": "master",
      "number": "MASTER 1234",
      "expDate": "12/2023",
    }
  ];

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
        items={data.map((item)=>{
          return {
            icon: (
              <sc-cc-logo
                style={{ fontSize: '36px' }}
                brand={item.icon}
              ></sc-cc-logo>
            ),
            number: (
              item.number
            ),
            exp: (
              item.expDate
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
