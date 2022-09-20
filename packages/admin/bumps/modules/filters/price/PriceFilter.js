import { ScFormatNumber } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import useEntity from '../../../../hooks/useEntity';
import { intervalString } from '../../../../util/translations';
import FilterItem from '../FilterItem';

export default ({ id, onRemove }) => {
	const { price, hasLoadedPrice } = useEntity('price', id, {
		expand: ['product'],
	});

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
