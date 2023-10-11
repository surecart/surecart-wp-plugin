/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import LineItem from './LineItem';
import { ScFormatNumber } from '@surecart/components-react';

export default ({
	lineItem,
	imageUrl,
	title,
	description,
	suffix,
	showWeight,
}) => {
	const variantLabel =
		(lineItem?.variant_options || []).filter(Boolean).join(' / ') || null;
	const priceName = lineItem?.price?.name;

	imageUrl = imageUrl || lineItem?.price?.product?.image_url;

	title = title || lineItem?.price?.product?.name;

	description = description || (
		<>
			<div>
				{variantLabel}
				{!!variantLabel && !!priceName && ' - '}
				{priceName}
			</div>
			{showWeight && !!lineItem?.price?.product?.weight && (
				<div>
					<ScFormatNumber
						type="unit"
						value={lineItem?.price?.product?.weight}
						unit={lineItem?.price?.product?.weight_unit}
					/>
				</div>
			)}
		</>
	);

	return (
		<LineItem imageUrl={imageUrl} suffix={suffix}>
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
				{title}
			</span>
			<span
				css={css`
					color: var(
						--sc-price-label-color,
						var(--sc-input-help-text-color)
					);
					font-size: var(
						--sc-price-label-font-size,
						var(--sc-input-help-text-font-size-medium)
					);
					line-height: var(--sc-line-height-dense);
				`}
			>
				{description}
			</span>
		</LineItem>
	);
};
