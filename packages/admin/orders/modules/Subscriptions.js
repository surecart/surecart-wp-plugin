import { __, _n } from '@wordpress/i18n';
import useCustomerData from '../hooks/useCustomerData';
import { useEffect } from '@wordpress/element';
import useDataApi from '../../hooks/useDataApi';
import SubscriptionsDataTable from '../../components/data-tables/SubscriptionsDataTable';
import useOrderData from '../hooks/useOrderData';

export default () => {
	const { orderId } = useOrderData();
	const [{ data, isLoading, error, pagination }, fetchData] = useDataApi();

	useEffect(() => {
		if (orderId) {
			fetchData({
				path: 'checkout-engine/v1/subscriptions',
				query: {
					order_ids: [orderId],
					context: 'edit',
					expand: ['price', 'price.product'],
				},
			});
		}
	}, [orderId]);

	return (
		<SubscriptionsDataTable
			data={data}
			isLoading={isLoading}
			error={error}
			pagination={pagination}
		/>
	);
};
