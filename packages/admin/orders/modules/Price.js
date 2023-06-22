/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import { intervalString } from '../../util/translations';
import {
	ScButton,
	ScCard,
	ScFlex,
	ScSkeleton,
	ScText,
	ScStackedList,
	ScFormatNumber,
	ScInput
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch, useSelect } from '@wordpress/data';
import ModelRow from './ModelRow';
import { store as uiStore } from '../../store/ui';

export default ({ price }) => {
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { setPricesForCreateOrder } = useDispatch(uiStore);
	const prices = useSelect((select) => select(uiStore).getPricesForCreateOrder());
	
	const onRemove = () => {
		
		let finalPrices = [
			...prices?.pricesForCreateOrder || []
		];

		finalPrices = finalPrices.filter(function(productItem) {
			return productItem?.id !== price?.id;
		});

		setPricesForCreateOrder(finalPrices);

		createSuccessNotice(__('Product removed.', 'surecart'), {
			type: 'snackbar',
		});
	};

	const onQuantityChange = () => {

	};
	console.log(price);
	return (
		<ScCard noPadding>
			<ScStackedList>
				<ModelRow
					icon={'image'}
					imageUrl={price?.product?.image_url}
					suffix={
						<div>
							{/* <ScInput
								label={__('Bump Name', 'surecart')}
								required
								help={__(
									'A name for this bump that will be visible to customers.',
									'surecart'
								)}
								onScInput={(e) => onQuantityChange({ quantity: e.target.value })}
								value={price?.quantity || 1 }
								name="name"
							/> */}
							<ScButton
								size="small"
								onClick={onRemove}
							>
								{__('Remove', 'surecart')}
							</ScButton>
						</div>
					}
				>
					<div>
						<strong>{price?.product?.name}</strong>
					</div>
					<ScFormatNumber
						type="currency"
						currency={price?.currency || 'usd'}
						value={price?.amount}
					/>
					{intervalString(price)}
				</ModelRow>
			</ScStackedList>
		</ScCard>
	);
};
