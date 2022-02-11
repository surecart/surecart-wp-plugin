import { __ } from '@wordpress/i18n';
import { useEffect, useState } from 'react';
import PurchasesDataTable from '../../../components/data-tables/purchases-data-table';
import useEntities from '../../../mixins/useEntities';

export default ({ loading }) => {
	const [page, setPage] = useState(1);
	const { purchases } = useEntities('purchase');

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
			page={page}
			setPage={setPage}
			isLoading={loading}
		/>
	);
};
