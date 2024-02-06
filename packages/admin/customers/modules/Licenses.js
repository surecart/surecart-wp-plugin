/**
 * External dependencies.
 */
import { __, _n } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import LicensesDataTable from '../../components/data-tables/licenses-data-table';

export default ({ customerId }) => {
	const { licenses, loading } = useSelect(
		(select) => {
			if (!customerId) {
				return {
					licenses: [],
					loading: false,
				};
			}
			const entityData = [
				'surecart',
				'license',
				{
					customer_ids: customerId ? [customerId] : null,
					per_page: 3,
					expand: [
						'purchase',
						'purchase.price',
						'purchase.product',
						'product.featured_product_media',
						'product_media.media',
					],
				},
			];
			return {
				licenses: select(coreStore)?.getEntityRecords?.(...entityData),
				loading: !select(coreStore)?.hasFinishedResolution?.(
					'getEntityRecords',
					[...entityData]
				),
			};
		},
		[customerId]
	);

	// We won't render anything if there are no licenses.
	if (!licenses?.length) {
		return null;
	}

	return (
		<LicensesDataTable
			columns={{
				item: {
					label: __('Item', 'surecart'),
				},
				actions: {
					width: '100px',
				},
			}}
			data={licenses}
			isLoading={loading}
		/>
	);
};
