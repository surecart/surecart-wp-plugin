import { __, _n } from '@wordpress/i18n';
import PurchasesDataTable from '../../components/data-tables/purchases-data-table';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

export default ({ checkoutId }) => {
	const { purchases, loading } = useSelect(
		(select) => {
			if (!checkoutId) {
				return {
					purchases: [],
					loading: true,
				};
			}
			const entityData = [
				'surecart',
				'purchase',
				{
					checkout_ids: checkoutId ? [checkoutId] : null,
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
		[checkoutId]
	);

	// empty, don't render anything.
	if (!loading && !purchases?.length) {
		return null;
	}

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
