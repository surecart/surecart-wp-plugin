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
	ScInput,
	ScStackedListRow
} from '@surecart/components-react';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch, useSelect } from '@wordpress/data';
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

	const onQuantityChange = (quantity) => {

		let finalPrices = [
			...prices?.pricesForCreateOrder || []
		];

		for (let priceItem in finalPrices) {
			if ( finalPrices[priceItem]?.id === price?.id ) {
				finalPrices[priceItem].quantity = quantity?.quantity;
			}
		}
		setPricesForCreateOrder(finalPrices);
	};
	const imageUrl = price?.product?.image_url;

	return (
		<ScStackedListRow
			style={{
				'--columns': '3',
			}}
		>
			<ScFlex alignItems="center" justifyContent="flex-start">
				{imageUrl ? (
					<img
						src={imageUrl}
						css={css`
							width: 40px;
							height: 40px;
							object-fit: cover;
							background: #f3f3f3;
							display: flex;
							align-items: center;
							justify-content: center;
							border-radius: var(
								--sc-border-radius-small
							);
						`}
					/>
				) : (
					<div
						css={css`
							width: 40px;
							height: 40px;
							object-fit: cover;
							background: var(--sc-color-gray-100);
							display: flex;
							align-items: center;
							justify-content: center;
							border-radius: var(
								--sc-border-radius-small
							);
						`}
					>
						<ScIcon
							style={{
								width: '18px',
								height: '18px',
							}}
							name={'image'}
						/>
					</div>
				)}
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
				</ScFlex>
				<div
					style={{
						'justifyContent': 'space-between',
						'alignItems': 'center'
					}}
				>
					<ScInput
						css={css`
							width: 30%;
						`}
						required
						onScInput={(e) => onQuantityChange({ quantity: e.target.value })}
						value={price?.quantity || 1 }
						name="name"
					/>
				</div>
				<div>
					<ScButton
						size="small"
						onClick={onRemove}
					>
						{__('Remove', 'surecart')}
					</ScButton>
				</div>
		</ScStackedListRow>
	);
};
