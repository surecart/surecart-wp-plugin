import { __, _n } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import useDataApi from '../../hooks/useDataApi';
import ChargesDataTable from '../../components/data-tables/ChargesDataTable';
import useOrderData from '../hooks/useOrderData';

export default () => {
	const { orderId } = useOrderData();
	const [{ data, isLoading, error, pagination }, fetchData] = useDataApi();

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
			data={data}
			isLoading={isLoading}
			error={error}
			pagination={pagination}
		/>
	);
};
