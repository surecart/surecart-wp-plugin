/**
 * External dependencies.
 */
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export const TAX_OVERRIDE_PER_PAGE = 100;

export default function useTaxOverrides(type, region, currentPage) {
	return useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'tax_override',
				{
					context: 'edit',
					per_page: TAX_OVERRIDE_PER_PAGE,
					page: currentPage,
					tax_region: [region],
					shipping: type === 'shipping',
				},
			];
			const taxOverridesData = select(coreStore).getEntityRecords(
				...queryArgs
			);

			// TODO: If API supports the shipping filtering, remove the filtering from JavaScript.
			let taxOverrides = [];
			if (type === 'shipping') {
				taxOverrides = (taxOverridesData || []).filter(
					(taxOverride) => !!taxOverride?.shipping
				);
			} else {
				taxOverrides = (taxOverridesData || []).filter(
					(taxOverride) => !!taxOverride?.product_collection?.id
				);
			}

			return {
				taxOverrides,
				fetching: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[region, type, currentPage]
	);
}
