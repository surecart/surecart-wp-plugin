import { __, _n } from '@wordpress/i18n';
import PurchasesDataTable from '../../components/data-tables/purchases-data-table';
import useEntities from '../../mixins/useEntities';
import { useEffect } from '@wordpress/element';
import useCurrentPage from '../../mixins/useCurrentPage';
import { useState } from 'react';

export default () => {
	const [page, setPage] = useState(1);
	const { id } = useCurrentPage();
	const {
		purchases,
		isLoading,
		pagination,
		error,
		fetchPurchases,
		isFetching,
	} = useEntities('purchase');

	useEffect(() => {
		id &&
			fetchPurchases({
				query: {
					customer_ids: [id],
					context: 'edit',
					expand: ['product', 'product.price'],
					per_page: 5,
					page,
				},
			});
	}, [id, page]);

	return (
		<PurchasesDataTable
			hideHeader={true}
			columns={{
				item: {
					label: __('Item', 'checkout_engine'),
				},
				actions: {
					width: '100px',
				},
			}}
			page={page}
			setPage={setPage}
			data={purchases}
			isFetching={isFetching}
			isLoading={isLoading}
			error={error}
			pagination={pagination}
		/>
	);
};
