import { ScFormatNumber } from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import useEntity from '../../../../hooks/useEntity';
import { intervalString } from '../../../../util/translations';
import FilterItem from '../FilterItem';

export default ({ id, onRemove }) => {
	const { price, hasLoadedPrice } = useSelect(
		(select) => {
			const entityData = [
				'surecart',
				'price',
				id,
				{
					expand: ['product'],
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
			imageUrl={price?.product?.image_url}
			icon={'image'}
			onRemove={onRemove}
		>
			<div>
				<div>
					<strong>{price?.product?.name}</strong>
				</div>
				<ScFormatNumber
					type="currency"
					currency={price?.currency || 'usd'}
					value={price?.amount}
				/>
				{intervalString(price)}
			</div>
		</FilterItem>
	);
};
