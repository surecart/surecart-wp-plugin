import { __, _n } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

import OrdersDataTable from '../../components/data-tables/OrdersDataTable';
import PrevNextButtons from '../../ui/PrevNextButtons';
import usePagination from '../../hooks/usePagination';

export default ({ customerId }) => {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);

	const { orders, updating, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'order',
				{
					context: 'edit',
					customer_ids: [customerId],
					expand: ['checkout', 'checkout.line_items'],
					page,
					per_page: perPage,
				},
			];
			const orders = select(coreStore).getEntityRecords(...queryArgs);
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);
			return {
				orders,
				loading: loading && page === 1,
				updating: loading && page !== 1,
			};
		},
		[customerId, page, perPage]
	);

	const { hasPagination } = usePagination({
		data: orders,
		page,
		perPage,
	});

	return (
		<OrdersDataTable
			title={__('Customer Orders', 'surecart')}
			columns={{
				number: {
					label: __('Number', 'surecart'),
					width: '150px',
				},
				items: {
					label: __('Items', 'surecart'),
				},
				total: {
					label: __('Total', 'surecart'),
				},
				status: {
					label: __('Status', 'surecart'),
					width: '100px',
				},
				date: {
					label: __('Date', 'surecart'),
					width: '100px',
				},
				actions: {
					width: '50px',
				},
			}}
			data={orders}
			isLoading={loading}
			isFetching={updating}
			perPage={perPage}
			page={page}
			setPage={setPage}
			empty={
				page > 1
					? __('No more orders.', 'surecart')
					: __('None found.', 'surecart')
			}
			footer={
				hasPagination && (
					<PrevNextButtons
						data={orders}
						page={page}
						setPage={setPage}
						perPage={perPage}
						loading={updating}
					/>
				)
			}
		/>
	);
};
