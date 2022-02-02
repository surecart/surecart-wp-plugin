import { __, _n } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import useDataApi from '../../hooks/useDataApi';
import ChargesDataTable from '../../components/data-tables/charges-data-table';
import useOrderData from '../hooks/useOrderData';

export default () => {
	const { orderId, purchases } = useOrderData();
	const { data, isLoading, error, pagination, fetchData } = useDataApi();

	useEffect(() => {
		if (orderId) {
			fetchData({
				path: 'checkout-engine/v1/charges',
				query: {
					order_ids: [orderId],
					context: 'edit',
					status: ['paid'],
					expand: ['payment_method', 'payment_method.card'],
				},
			});
		}
	}, [orderId]);

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
			purchases={purchases}
			data={data}
			isLoading={isLoading}
			error={error}
			pagination={pagination}
		/>
	);
};
