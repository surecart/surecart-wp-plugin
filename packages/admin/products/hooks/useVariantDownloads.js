/**
 * External dependencies.
 */
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

/**
 * Hook to fetch downloads for a variant.
 * Shared between Variations/Downloads.js and Variations/Licensing.js.
 *
 * @param {Object}  params
 * @param {Object}  params.variant          - The variant object.
 * @param {boolean} params.isCustomDownloads - Whether custom downloads mode is enabled.
 * @returns {{ downloads: Array, fetching: boolean }}
 */
export default function useVariantDownloads({ variant, isCustomDownloads }) {
	return useSelect(
		(select) => {
			if (!variant?.id || !isCustomDownloads) {
				return {
					downloads: [],
					fetching: false,
				};
			}

			const queryArgs = [
				'surecart',
				'download',
				{
					context: 'edit',
					variant_ids: [variant.id],
					per_page: 100,
					expand: ['media'],
				},
			];
			return {
				downloads: select(coreStore).getEntityRecords(...queryArgs),
				fetching: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[variant?.id, isCustomDownloads]
	);
}
