import { __, _n } from '@wordpress/i18n';
import SubscriptionsDataTable from '../../components/data-tables/subscriptions-data-table';
import useEntities from '../../mixins/useEntities';
import { useEffect, useState } from '@wordpress/element';

export default ({ id }) => {
	const [page, setPage] = useState(1);
	const {
		subscriptions,
		isLoading,
		pagination,
		fetchSubscriptions,
		isFetching,
	} = useEntities('subscription');

	useEffect(() => {
		if (id) {
			fetchSubscriptions({
				query: {
					customer_ids: [id],
					context: 'edit',
					expand: ['price', 'price.product'],
					page: page,
					per_page: 5,
				},
			});
		}
	}, [id, page]);

	return (
		<SubscriptionsDataTable
			hideHeader={true}
			columns={{
				status: {
					label: __('Status', 'checkout_engine'),
					width: '100px',
				},
				product: {
					label: __('Product', 'checkout_engine'),
				},
				renews: {
					label: __('Renews', 'checkout_engine'),
				},
				created: {
					label: __('Created', 'checkout_engine'),
				},
				view: {
					width: '100px',
				},
			}}
			empty={__(
				'This customer does not have any subscriptions.',
				'checkout_engine'
			)}
			data={subscriptions}
			isLoading={isLoading}
			isFetching={isFetching}
			page={page}
			setPage={setPage}
			pagination={pagination}
		/>
	);
};
