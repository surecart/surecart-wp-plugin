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
				'tax-override',
				{
					context: 'edit',
					per_page: TAX_OVERRIDE_PER_PAGE,
					page: currentPage,
					tax_region: [region],
					shipping: type === 'shipping',
				},
			];

			return {
				taxOverrides:
					select(coreStore).getEntityRecords(...queryArgs) || [],
				fetching: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[region, type, currentPage]
	);
}
