import { ScButton, ScLineItem } from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

import Box from '../../ui/Box';

export default ({ licenseId }) => {
	const { purchase, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'purchase',
				{
					context: 'edit',
					license_ids: [licenseId],
					expand: [
						'product',
						'product.featured_product_media',
						'product_media.media',
					],
					per_page: 100,
				},
			];
			return {
				purchase: select(coreStore).getEntityRecords(...queryArgs)?.[0],
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
				loadingError: select(coreStore)?.getResolutionError?.(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[licenseId]
	);

	return (
		<Box
			title={__('Purchase', 'surecart')}
			loading={loading}
			footer={
				!loading && (
					<div>
						<ScButton
							href={addQueryArgs('admin.php', {
								page: 'sc-products',
								action: 'edit',
								id: purchase?.product?.id || purchase?.product,
							})}
						>
							{__('View Product', 'surecart')}
						</ScButton>
					</div>
				)
			}
		>
			<ScLineItem>
				{!!purchase?.product?.line_item_image?.src && (
					<img {...purchase?.product?.line_item_image} slot="image" />
				)}
				<span slot="title">{purchase?.product?.name}</span>
				<span className="product__description" slot="description">
					<span>Qty: {purchase?.quantity}</span>{' '}
					{purchase?.revoked && (
						<sc-tag size="small" type="danger">
							{__('Revoked', 'surecart')}
						</sc-tag>
					)}
				</span>
			</ScLineItem>
		</Box>
	);
};
