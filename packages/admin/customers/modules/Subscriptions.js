import { __, _n } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

import PrevNextButtons from '../../ui/PrevNextButtons';
import usePagination from '../../hooks/usePagination';
import SubscriptionsDataTable from '../../components/data-tables/subscriptions-data-table';

export default ({ customerId }) => {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);

	const { subscriptions, updating, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'subscription',
				{
					context: 'edit',
					customer_ids: [customerId],
					expand: ['price', 'price.product'],
					page,
					per_page: perPage,
				},
			];
			const subscriptions = select(coreStore).getEntityRecords(
				...queryArgs
			);
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);
			return {
				subscriptions,
				loading: loading && page === 1,
				updating: loading && page !== 1,
			};
		},
		[customerId, page, perPage]
	);

	const { hasPagination } = usePagination({
		data: subscriptions,
		page,
		perPage,
	});

	return (
		<SubscriptionsDataTable
			title={__('Subscriptions', 'surecart')}
			columns={{
				status: {
					label: __('Status', 'surecart'),
					width: '100px',
				},
				product: {
					label: __('Product', 'surecart'),
				},
				plan: {
					label: __('Renews', 'surecart'),
				},
				created: {
					label: __('Created', 'surecart'),
				},
				view: {
					width: '100px',
				},
			}}
			data={subscriptions}
			showTotal
			isLoading={loading}
			isFetching={updating}
			perPage={perPage}
			page={page}
			setPage={setPage}
			empty={
				page > 1
					? __('No more subscriptions.', 'surecart')
					: __('None found.', 'surecart')
			}
			footer={
				hasPagination && (
					<PrevNextButtons
						data={subscriptions}
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

// import { __, _n } from '@wordpress/i18n';
// import SubscriptionsDataTable from '../../components/data-tables/subscriptions-data-table';
// import useEntities from '../../mixins/useEntities';
// import { useEffect, useState } from '@wordpress/element';

// export default ({ id }) => {
// 	const [page, setPage] = useState(1);
// 	const {
// 		subscriptions,
// 		isLoading,
// 		pagination,
// 		fetchSubscriptions,
// 		isFetching,
// 	} = useEntities('subscription');

// 	useEffect(() => {
// 		if (id) {
// 			fetchSubscriptions({
// 				query: {
// 					customer_ids: [id],
// 					context: 'edit',
// 					expand: ['price', 'price.product'],
// 					page: page,
// 					per_page: 5,
// 				},
// 			});
// 		}
// 	}, [id, page]);

// 	return (
// 		<SubscriptionsDataTable
// 			hideHeader={true}
// 			columns={{
// 				status: {
// 					label: __('Status', 'surecart'),
// 					width: '100px',
// 				},
// 				product: {
// 					label: __('Product', 'surecart'),
// 				},
// 				renews: {
// 					label: __('Renews', 'surecart'),
// 				},
// 				created: {
// 					label: __('Created', 'surecart'),
// 				},
// 				view: {
// 					width: '100px',
// 				},
// 			}}
// 			empty={__(
// 				'This customer does not have any subscriptions.',
// 				'surecart'
// 			)}
// 			data={subscriptions}
// 			isLoading={isLoading}
// 			isFetching={isFetching}
// 			page={page}
// 			setPage={setPage}
// 			pagination={pagination}
// 		/>
// 	);
// };
