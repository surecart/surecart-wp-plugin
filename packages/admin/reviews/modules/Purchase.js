/**
 * External dependencies.
 */
import { __, _n } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import ProductLineItem from '../../ui/ProductLineItem';
import Box from '../../ui/Box';
import { ScButton } from '@surecart/components-react';

export default ({ review, loading }) => {
	if (!review?.purchase_id) {
		return null;
	}

	const { purchase, purchaseLoading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'purchase',
				review.purchase_id,
				{
					expand: [
						'product',
						'product.featured_product_media',
						'product.product_medias',
						'product_media.media',
						'variant',
						'price',
					],
				},
			];
			return {
				purchase: select(coreStore).getEntityRecord(...queryArgs),
				purchaseLoading: select(coreStore).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[review?.purchase_id]
	);

	const { id, quantity, variant, product, price } = purchase || {};

	return (
		<Box
			title={__('Purchase', 'surecart')}
			loading={loading || purchaseLoading}
			footer={
				!loading &&
				!purchaseLoading &&
				!!purchase?.initial_order && (
					<div>
						<ScButton
							size="small"
							href={addQueryArgs('admin.php', {
								page: 'sc-orders',
								action: 'edit',
								id: purchase?.initial_order,
							})}
							target="_blank"
						>
							{__('View Order', 'surecart')}
						</ScButton>
					</div>
				)
			}
		>
			<ProductLineItem
				key={id}
				lineItem={{
					price: {
						...price,
						product: product,
					},
					variant: variant,
					variant_options: [
						variant?.option_1,
						variant?.option_2,
						variant?.option_3,
					],
				}}
			>
				<span>
					{__('Qty:', 'surecart')} {quantity}
				</span>
			</ProductLineItem>
		</Box>
	);
};
