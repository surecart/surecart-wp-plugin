import { __, _n } from '@wordpress/i18n';
import SubscriptionsDataTable from '../../components/data-tables/subscriptions-data-table';
import { useEffect } from '@wordpress/element';
import useCurrentPage from '../../mixins/useCurrentPage';
import useEntities from '../../mixins/useEntities';

export default () => {
	const { id } = useCurrentPage();
	const { subscriptions, isLoading, pagination, error, fetchSubscriptions } =
		useEntities('subscription');

	useEffect(() => {
		id &&
			fetchSubscriptions({
				query: {
					order_ids: [id],
					context: 'edit',
					expand: ['price', 'price.product', 'latest_invoice'],
				},
			});
	}, [id]);

	return (
		<SubscriptionsDataTable
			columns={{
				status: {
					label: __('Status', 'surecart'),
					width: '100px',
				},
				product: {
					label: __('Product', 'surecart'),
				},
				plan: {
					label: __('Plan', 'surecart'),
				},
				created: {
					label: __('Created', 'surecart'),
				},
				view: {
					width: '100px',
				},
			}}
			data={subscriptions}
			isLoading={isLoading}
			error={error}
			pagination={pagination}
		/>
	);
};
