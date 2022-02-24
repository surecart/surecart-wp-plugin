import { __, _n } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import ChargesDataTable from '../../components/data-tables/charges-data-table';
import { useState } from 'react';
import useEntities from '../../mixins/useEntities';

export default ({ id }) => {
	const [page, setPage] = useState(1);
	const { charges, fetchCharges, pagination, isLoading, isFetching } =
		useEntities('charge');

	useEffect(() => {
		if (id) {
			fetchCharges({
				query: {
					context: 'edit',
					status: ['paid', 'failed'],
					customer_ids: [id],
					expand: ['payment_method', 'payment_method.card'],
					page,
					per_page: 5,
				},
			});
		}
	}, [id, page]);

	return (
		<ChargesDataTable
			hideHeader={true}
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
			data={charges}
			isLoading={isLoading}
			isFetching={isFetching}
			page={page}
			setPage={setPage}
			pagination={pagination}
		/>
	);
};
