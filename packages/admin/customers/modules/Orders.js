import { __, _n } from '@wordpress/i18n';
import useCustomerData from '../hooks/useCustomerData';
import { useEffect } from '@wordpress/element';
import useDataApi from '../../hooks/useDataApi';
import OrdersDataTable from '../../components/data-tables/OrdersDataTable';

export default () => {
	const { customerId } = useCustomerData();
	const { data, isLoading, error, pagination, fetchData } = useDataApi();

	useEffect(() => {
		if (customerId) {
			fetchData({
				path: 'checkout-engine/v1/orders',
				query: {
					customer_ids: [customerId],
					context: 'edit',
					status: ['paid'],
					expand: ['payment_method', 'line_items'],
				},
			});
		}
	}, [customerId]);

	return (
		<OrdersDataTable
			columns={{
				number: {
					label: __('Order Number', 'checkout_engine'),
				},
				items: {
					label: __('Items', 'checkout_engine'),
				},
				total: {
					label: __('Total', 'checkout_engine'),
				},
				status: {
					label: __('Status', 'checkout_engine'),
					width: '100px',
				},
				actions: {
					width: '100px',
				},
			}}
			data={data}
			isLoading={isLoading}
			error={error}
			pagination={pagination}
		/>
	);
};
