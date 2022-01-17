import { __, _n } from '@wordpress/i18n';
import useCustomerData from '../hooks/useCustomerData';
import { useEffect } from '@wordpress/element';
import useDataApi from '../../hooks/useDataApi';
import ChargesDataTable from '../../components/data-tables/ChargesDataTable';

export default () => {
	const { customerId } = useCustomerData();
	const [{ data, isLoading, error, pagination }, fetchData] = useDataApi();

	useEffect(() => {
		if (customerId) {
			fetchData({
				path: 'checkout-engine/v1/charges',
				query: {
					customer_ids: [customerId],
					context: 'edit',
					status: ['paid'],
					expand: ['payment_method', 'payment_method.card'],
				},
			});
		}
	}, [customerId]);

	return (
		<ChargesDataTable
			data={data}
			isLoading={isLoading}
			error={error}
			pagination={pagination}
		/>
	);
};
