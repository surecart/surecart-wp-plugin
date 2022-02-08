import { __, _n } from '@wordpress/i18n';
import useCustomerData from '../hooks/useCustomerData';
import SubscriptionsDataTable from '../../components/data-tables/subscriptions-data-table';
import useEntities from '../../mixins/useEntities';

export default () => {
	const { customerId } = useCustomerData();

	const { data, isLoading, pagination, error } = useEntities(
		'root',
		'subscription',
		{
			customer_ids: [customerId],
			context: 'edit',
			expand: ['price', 'price.product'],
		}
	);

	return (
		<SubscriptionsDataTable
			columns={{
				status: {
					label: __('Status', 'checkout_engine'),
					width: '100px',
				},
				product: {
					label: __('Product', 'checkout_engine'),
				},
				renews: {
					label: __('Renews', 'checkout_engine'),
				},
				created: {
					label: __('Created', 'checkout_engine'),
				},
				actions: {
					width: '100px',
				},
			}}
			empty={__(
				'This customer does not have any subscriptions.',
				'checkout_engine'
			)}
			data={data}
			isLoading={isLoading}
			error={error}
			pagination={pagination}
		/>
	);
};
