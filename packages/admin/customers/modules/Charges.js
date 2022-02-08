import { __, _n } from '@wordpress/i18n';
import useCustomerData from '../hooks/useCustomerData';
import { useEffect } from '@wordpress/element';
import useDataApi from '../../hooks/useDataApi';
import ChargesDataTable from '../../components/data-tables/charges-data-table';

export default () => {
	const { customerId } = useCustomerData();
	const { data, isLoading, error, pagination, fetchData } = useDataApi();

	useEffect(() => {
		if (customerId) {
			fetchData({
				path: 'checkout-engine/v1/charges',
				query: {
					customer_ids: [customerId],
					context: 'edit',
					status: ['paid'],
					expand: [
						'payment_method',
						'payment_method.card',
						'order',
						'order.purchases',
						'purchase.product',
					],
				},
			});
		}
	}, [customerId]);

	return (
		<ChargesDataTable
			columns={{
				amount: {
					label: __('Amount', 'checkout_engine'),
				},
				date: {
					label: __('Date', 'checkout_engine'),
				},
				method: {
					label: __('Method', 'checkout_engine'),
				},
				status: {
					label: __('Status', 'checkout_engine'),
					width: '100px',
				},
				refund: {
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
