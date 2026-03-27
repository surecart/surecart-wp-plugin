/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import LineItem from './LineItem';
import {
	ScFormatNumber,
	ScProductLineItemNote,
} from '@surecart/components-react';
import LineItemLabel from './LineItemLabel';

export default ({ lineItem, suffix, showWeight, showQuantity, children }) => {
	return (
		<LineItem suffix={suffix} image={lineItem?.image}>
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
							lineItem.quantity - lineItem.fulfilled_quantity || 0
						)}
					</div>
				)}
				<ScProductLineItemNote note={lineItem?.display_note} />
				{children}
			</LineItemLabel>
		</LineItem>
	);
};
