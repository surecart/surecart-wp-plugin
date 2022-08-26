import { __, _n } from '@wordpress/i18n';
import PurchasesDataTable from '../../components/data-tables/purchases-data-table';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

export default ({ customerId }) => {
	const { purchases, loading } = useSelect(
		(select) => {
			if (!customerId) {
				return {
					purchases: [],
					loading: true,
				};
			}
			const entityData = [
				'surecart',
				'purchase',
				{
					customer_ids: customerId ? [customerId] : null,
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
		[customerId]
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
