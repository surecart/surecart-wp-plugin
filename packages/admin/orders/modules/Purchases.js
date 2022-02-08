import { __, _n } from '@wordpress/i18n';
import PurchasesDataTable from '../../components/data-tables/purchases-data-table';
import useEntities from '../../mixins/useEntities';
import { useEffect } from '@wordpress/element';
import useCurrentPage from '../../mixins/useCurrentPage';

export default () => {
	const { id } = useCurrentPage();
	const { data, isLoading, pagination, error, fetchEntities } =
		useEntities('purchase');

	useEffect(() => {
		id &&
			fetchEntities({
				query: {
					order_ids: [id],
					context: 'edit',
					expand: ['product', 'product.price'],
				},
			});
	}, [id]);

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
			// onUpdatePurchase={editEntityRecord}
			data={data}
			isLoading={isLoading}
			error={error}
			pagination={pagination}
		/>
	);
};
