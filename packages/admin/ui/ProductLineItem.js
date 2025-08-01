/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import LineItem from './LineItem';
import { ScFormatNumber } from '@surecart/components-react';
import LineItemLabel from './LineItemLabel';

export default ({ lineItem, suffix, showWeight, showQuantity, children }) => {
	const [noteExpanded, setNoteExpanded] = useState(false);
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
				{!!lineItem?.note && (
					<div
						css={css`
							margin-top: 0.5em;
						`}
					>
						<div
							css={css`
								font-style: italic;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: ${noteExpanded ? 'none' : '1'};
								-webkit-box-orient: vertical;
								line-clamp: ${noteExpanded ? 'none' : '1'};
							`}
						>
							{__('Note:', 'surecart')} {lineItem.note}
						</div>
						<button
							css={css`
								background: none;
								border: none;
								color: var(--sc-color-primary-500, #3858e9);
								cursor: pointer;
								font-size: 13px;
								padding: 0;
								margin-top: 2px;
								text-decoration: underline;
								transition: opacity 0.2s ease;
								
								&:hover {
									opacity: 0.8;
								}
								
								&:focus {
									outline: 2px solid var(--sc-color-primary-500, #3858e9);
									outline-offset: 2px;
								}
							`}
							onClick={() => setNoteExpanded(!noteExpanded)}
							type="button"
						>
							{noteExpanded ? __('less', 'surecart') : __('more', 'surecart')}
						</button>
					</div>
				)}
				{children}
			</LineItemLabel>
		</LineItem>
	);
};
