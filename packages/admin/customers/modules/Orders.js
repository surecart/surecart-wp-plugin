import { __, _n } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import OrdersDataTable from '../../components/data-tables/OrdersDataTable';
import useEntities from '../../mixins/useEntities';
import { useState } from 'react';

export default ({ id }) => {
	const [page, setPage] = useState(1);
	const { orders, fetchOrders, pagination, isLoading, isFetching } =
		useEntities('order');

	useEffect(() => {
		if (id) {
			fetchOrders({
				query: {
					context: 'edit',
					customer_ids: [id],
					status: [
						'paid',
						'canceled',
						'payment_failed',
						'payment_intent_canceled',
					],
					expand: ['line_items'],
					page,
					per_page: 5,
				},
			});
		}
	}, [id, page]);

	return (
		<OrdersDataTable
			hideHeader={true}
			title={__('Customer Orders', 'surecart')}
			columns={{
				number: {
					label: __('Number', 'surecart'),
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
				},
				actions: {
					width: '100px',
				},
			}}
			data={orders}
			isLoading={isLoading}
			isFetching={isFetching}
			page={page}
			setPage={setPage}
			pagination={pagination}
		/>
	);
};
