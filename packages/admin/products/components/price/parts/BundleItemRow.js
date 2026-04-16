/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { getFeaturedProductMediaAttributes } from '@surecart/components';
import {
	ScButton,
	ScCard,
	ScDropdown,
	ScFlex,
	ScFormatNumber,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScQuantitySelect,
	ScStackedListRow,
} from '@surecart/components-react';

/**
 * Single bundle item row — matches SwapPriceDisplay pattern.
 */
const BundleItemRow = ({ item, onUpdate, onRemove }) => {
	const product = item?.product || item?.price?.product;
	const productName = product?.name || __('Unknown Product', 'surecart');
	const priceName = item?.price?.name || '';
	const variantName = item?.variant?.name || '';
	const media = product ? getFeaturedProductMediaAttributes(product) : {};

	return (
		<ScStackedListRow>
			<ScFlex alignItems="center" justifyContent="flex-start">
				{media?.url ? (
					<img
						src={media.url}
						alt={media.alt || productName}
						{...(media.title ? { title: media.title } : {})}
						css={css`
							width: 40px;
							height: 40px;
							object-fit: cover;
							background: #f3f3f3;
							display: flex;
							align-items: center;
							justify-content: center;
							border-radius: var(--sc-border-radius-small);
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
							border-radius: var(--sc-border-radius-small);
						`}
					>
						<ScIcon
							style={{ width: '18px', height: '18px' }}
							name="image"
						/>
					</div>
				)}
				<div>
					<div>
						<strong>{productName}</strong>
					</div>
					{(priceName || variantName) && (
						<div
							css={css`
								font-size: var(--sc-font-size-x-small);
								color: var(--sc-color-gray-500);
							`}
						>
							{[priceName, variantName]
								.filter(Boolean)
								.join(' / ')}
						</div>
					)}
					{item?.price?.amount != null && (
						<ScFormatNumber
							value={item.price.amount}
							type="currency"
							currency={item.price.currency}
						/>
					)}
				</div>
			</ScFlex>

			<ScFlex
				slot="suffix"
				alignItems="center"
				justifyContent="flex-end"
				css={css`
					gap: var(--sc-spacing-x-small);
				`}
			>
				<ScQuantitySelect
					quantity={item?.quantity || 1}
					min={1}
					size="small"
					onScChange={(e) => {
						const qty = parseInt(e.detail, 10);
						if (qty > 0) {
							onUpdate({ quantity: qty });
						}
					}}
				/>
				<ScDropdown placement="bottom-end">
					<ScButton type="text" slot="trigger" circle>
						<ScIcon name="more-horizontal" />
					</ScButton>
					<ScMenu>
						<ScMenuItem onClick={() => onRemove()}>
							<ScIcon slot="prefix" name="trash" />
							{__('Remove', 'surecart')}
						</ScMenuItem>
					</ScMenu>
				</ScDropdown>
			</ScFlex>
		</ScStackedListRow>
	);
};

export default BundleItemRow;
