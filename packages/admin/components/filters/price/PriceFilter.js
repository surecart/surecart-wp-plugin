import { ScFormatNumber } from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import { intervalString } from '../../../../admin/util/translations';
import FilterItem from '../FilterItem';
import LineItemLabel from '../../../ui/LineItemLabel';
import { getFeaturedProductMediaAttributes } from '@surecart/components';

export default ({ id, onRemove }) => {
	const { price, hasLoadedPrice } = useSelect(
		(select) => {
			const entityData = [
				'surecart',
				'price',
				id,
				{
					expand: [
						'product',
						'product.featured_product_media',
						'product_media.media',
					],
					t: '1', // clear any cache to fetch fresh.
				},
			];
			return {
				price: select(coreStore)?.getEditedEntityRecord?.(
					...entityData
				),
				hasLoadedPrice: select(coreStore)?.hasFinishedResolution?.(
					'getEditedEntityRecord',
					[...entityData]
				),
			};
		},
		[id]
	);

	return (
		<FilterItem
			loading={!hasLoadedPrice}
			media={getFeaturedProductMediaAttributes(price?.product)}
			icon={'image'}
			onRemove={onRemove}
		>
			<div>
				<div>
					<strong>{price?.product?.name}</strong>
				</div>
				<LineItemLabel lineItem={{ price: price }}>
					<ScFormatNumber
						type="currency"
						currency={price?.currency || 'usd'}
						value={price?.amount}
					/>
					{intervalString(price)}
				</LineItemLabel>
			</div>
		</FilterItem>
	);
};
