import { __, _n } from '@wordpress/i18n';
import useCustomerData from '../hooks/useCustomerData';
import { useEffect } from '@wordpress/element';
import useDataApi from '../../hooks/useDataApi';
import SubscriptionsDataTable from '../../components/data-tables/SubscriptionsDataTable';

export default () => {
	const { customerId } = useCustomerData();
	const { data, isLoading, error, pagination, fetchData } = useDataApi();

	useEffect(() => {
		if (customerId) {
			fetchData({
				path: 'checkout-engine/v1/subscriptions',
				query: {
					customer_ids: [customerId],
					context: 'edit',
					expand: ['price', 'price.product'],
				},
			});
		}
	}, [customerId]);

	return (
		<SubscriptionsDataTable
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
