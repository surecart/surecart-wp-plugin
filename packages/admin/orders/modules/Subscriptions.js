import { __, _n } from '@wordpress/i18n';
import SubscriptionsDataTable from '../../components/data-tables/subscriptions-data-table';
import { useEffect } from '@wordpress/element';
import useCurrentPage from '../../mixins/useCurrentPage';
import useEntities from '../../mixins/useEntities';

export default () => {
	const { id } = useCurrentPage();
	const { data, isLoading, pagination, error, fetchEntities } =
		useEntities('subscription');

	useEffect(() => {
		id &&
			fetchEntities({
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
					label: __('Status', 'checkout_engine'),
					width: '100px',
				},
				product: {
					label: __('Product', 'checkout_engine'),
				},
				plan: {
					label: __('Plan', 'checkout_engine'),
				},
				created: {
					label: __('Created', 'checkout_engine'),
				},
				actions: {
					width: '100px',
				},
			}}
			data={data}
			isLoading={isLoading}
			error={error}
			pagination={pagination}
		/>
	);
};
