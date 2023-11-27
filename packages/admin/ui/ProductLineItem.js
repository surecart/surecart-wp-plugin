/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import LineItem from './LineItem';
import { ScFormatNumber } from '@surecart/components-react';
import LineItemLabel from './LineItemLabel';
import { getFeaturedProductMediaAttributes } from '@surecart/components';

export default ({ lineItem, suffix, showWeight, showQuantity, children }) => {
	const { url, alt, title } = getFeaturedProductMediaAttributes(
		lineItem?.price?.product,
		lineItem?.variant
	);

	return (
		<LineItem suffix={suffix} media={{ url, alt, title }}>
			<span
				css={css`
					box-sizing: border-box;
					min-width: 0px;
					margin: 0;
					color: var(
						--sc-line-item-title-color,
						var(--sc-input-label-color)
					);
					font-size: var(--sc-font-size-medium);
					font-weight: var(--sc-font-weight-semibold);
					line-height: var(--sc-line-height-dense);
					cursor: pointer;
					display: -webkit-box;
					display: -moz-box;
					-webkit-box-orient: vertical;
					-moz-box-orient: vertical;
					-webkit-line-clamp: 3;
					-moz-box-lines: 3;
					overflow: hidden;
					text-overflow: ellipsis;
				`}
			>
				{lineItem?.price?.product?.name}
			</span>

			<LineItemLabel lineItem={lineItem}>
				{children}
				{showWeight && !!lineItem?.price?.product?.weight && (
					<div>
						<ScFormatNumber
							type="unit"
							value={lineItem?.price?.product?.weight}
							unit={lineItem?.price?.product?.weight_unit}
						/>
					</div>
				)}
				{showQuantity && !!lineItem?.quantity && (
					<div>
						{sprintf(
							__('Qty: %d', 'surecart'),
							line_item.quantity - line_item.fulfilled_quantity ||
								0
						)}
					</div>
				)}
			</LineItemLabel>
		</LineItem>
	);
};
