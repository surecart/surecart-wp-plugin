import { __, _n } from '@wordpress/i18n';
import SubscriptionsDataTable from '../../components/data-tables/subscriptions-data-table';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

export default ({ checkoutId }) => {
	const { subscriptions, loading } = useSelect(
		(select) => {
			if (!checkoutId) {
				return {
					subscriptions: [],
					loading: true,
				};
			}
			const entityData = [
				'surecart',
				'subscription',
				{
					checkout_ids: checkoutId ? [checkoutId] : null,
					expand: ['price', 'price.product'],
				},
			];
			return {
				subscriptions: select(coreStore)?.getEntityRecords?.(
					...entityData
				),
				loading: !select(coreStore)?.hasFinishedResolution?.(
					'getEntityRecords',
					[...entityData]
				),
			};
		},
		[checkoutId]
	);

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
			isLoading={loading}
		/>
	);
};
