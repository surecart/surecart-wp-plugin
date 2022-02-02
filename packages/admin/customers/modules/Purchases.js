import { __, _n } from '@wordpress/i18n';
import useCustomerData from '../hooks/useCustomerData';
import { useEffect } from '@wordpress/element';
import useDataApi from '../../hooks/useDataApi';
import PurchasesDataTable from '../../components/data-tables/purchases-data-table';

export default () => {
	const { customerId } = useCustomerData();
	const { data, isLoading, error, pagination, fetchData, updateDataItem } =
		useDataApi();

	useEffect(() => {
		if (customerId) {
			fetchData({
				path: 'checkout-engine/v1/purchases',
				query: {
					customer_ids: [customerId],
					context: 'edit',
					expand: ['product', 'product.price'],
				},
			});
		}
	}, [customerId]);

	return (
		<PurchasesDataTable
			columns={{
				item: {
					label: __('Item', 'checkout_engine'),
				},
				actions: {
					width: '100px',
				},
			}}
			onUpdatePurchase={updateDataItem}
			data={data}
			isLoading={isLoading}
			error={error}
			pagination={pagination}
		/>
	);
};
