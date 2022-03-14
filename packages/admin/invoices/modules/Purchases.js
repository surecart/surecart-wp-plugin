import { __, _n } from '@wordpress/i18n';
import PurchasesDataTable from '../../components/data-tables/purchases-data-table';
import useEntities from '../../mixins/useEntities';
import { useEffect } from '@wordpress/element';
import useCurrentPage from '../../mixins/useCurrentPage';

export default () => {
	const { id } = useCurrentPage();
	const { purchases, isLoading, pagination, error, fetchPurchases } =
		useEntities('purchase');

	useEffect(() => {
		id &&
			fetchPurchases({
				query: {
					invoice_ids: [id],
					context: 'edit',
					expand: ['product', 'product.price'],
				},
			});
	}, [id]);

	if (!isLoading && !purchases.length) {
		return null;
	}

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
			data={purchases}
			isLoading={isLoading}
			error={error}
			pagination={pagination}
		/>
	);
};
