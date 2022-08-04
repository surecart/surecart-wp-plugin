import PurchasesDataTable from '../../../components/data-tables/purchases-data-table';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { __, _n } from '@wordpress/i18n';

export default ({ subscriptionId }) => {
	const { purchases, loading } = useSelect(
		(select) => {
			if (!subscriptionId) {
				return {
					purchases: [],
					loading: true,
				};
			}
			const entityData = [
				'surecart',
				'purchase',
				{
					subscription_ids: subscriptionId ? [subscriptionId] : null,
					expand: ['product'],
				},
			];
			return {
				purchases: select(coreStore)?.getEntityRecords?.(...entityData),
				loading: !select(coreStore)?.hasFinishedResolution?.(
					'getEntityRecords',
					[...entityData]
				),
			};
		},
		[subscriptionId]
	);

	return (
		<PurchasesDataTable
			columns={{
				item: {
					label: __('Item', 'surecart'),
				},
				actions: {
					width: '100px',
				},
			}}
			data={purchases}
			isLoading={loading}
		/>
	);
};
