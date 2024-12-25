/**
 * External dependencies.
 */
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

const useRefund = (chargeId) => {
	return useSelect(
		(select) => {
			if (!chargeId) {
				return {
					refunds: [],
					loading: false,
				};
			}

			const queryArgs = [
				'surecart',
				'refund',
				{
					context: 'edit',
					charge_ids: [chargeId],
					per_page: 100,
					expand: [
						'refund_items',
						'refund_item.line_item',
						'line_item.price',
						'line_item.variant',
						'variant.image',
						'price.product',
						'product.featured_product_media',
						'product.product_medias',
						'product_media.media',
					],
				},
			];
			const refunds = select(coreStore).getEntityRecords(...queryArgs);
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);
			return {
				refunds,
				loading,
			};
		},
		[chargeId]
	);
};

export default useRefund;
