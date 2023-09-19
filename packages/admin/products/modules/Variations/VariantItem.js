/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScInput,
	ScMenu,
	ScMenuItem,
	ScPriceInput,
	ScTooltip,
} from '@surecart/components-react';
import Image from './Image';
import { maybeConvertAmount } from '../../../util';

export default ({ variant, updateVariant, prices }) => {
	const { sku, status, image_id, stock, amount, currency } = variant;

	/**
	 * Link media.
	 */
	const onLinkMedia = (media) =>
		updateVariant({ image_id: media?.id, image_url: media?.url });

	/**
	 * Unlink Media
	 */
	const onUnlinkMedia = () => {
		const confirmUnlinkMedia = confirm(
			__(
				'Are you sure you wish to unlink this variant image?',
				'surecart'
			)
		);
		if (!confirmUnlinkMedia) return;
		updateVariant({ image_id: null, image_url: null });
	};

	/**
	 * Render the variant name.
	 */
	const renderName = () => {
		const { option_1, option_2, option_3, status } = variant;
		const Tag = status === 'draft' ? 'del' : 'span';
		const colorStyle =
			status === 'draft' ? { color: 'var(--sc-color-gray-400)' } : {};

		return (
			<Tag style={colorStyle}>
				{option_1}
				{!!option_2?.length && ' / '}
				{option_2}
				{!!option_3?.length && ' / '}
				{option_3}
			</Tag>
		);
	};

	return {
		variant: (
			<div
				css={css`
					display: flex;
					align-items: center;
					justify-content: flex-start;
					gap: 1em;
				`}
			>
				<Image
					variant={variant}
					existingMediaIds={image_id ? [image_id] : []}
					onAdd={onLinkMedia}
					onRemove={onUnlinkMedia}
				/>
				<div
					css={css`
						font-weight: bold;
						flex: 1;
					`}
				>
					{renderName(variant)}
				</div>
			</div>
		),
		amount: (
			<>
				{(prices || [])?.length > 1 ? (
					<ScTooltip
						type="text"
						text={__(
							'Product has multiple prices. Please keep only one price to maintain variant wise pricing.',
							'surecart'
						)}
					>
						-
					</ScTooltip>
				) : (
					<ScPriceInput
						type="number"
						min="0"
						value={amount}
						placeholder={maybeConvertAmount(
							prices?.[0]?.amount,
							prices?.[0]?.currency || 'usd'
						)}
						currency={currency}
						disabled={status === 'draft'}
						onScInput={(e) =>
							updateVariant({ amount: e.target.value })
						}
					/>
				)}
			</>
		),
		stock: (
			<ScInput
				value={stock ?? 0}
				disabled={status === 'draft'}
				onScInput={(e) => updateVariant({ stock: e.target.value })}
			/>
		),
		sku: (
			<ScInput
				value={sku}
				disabled={status === 'draft'}
				onScInput={(e) => updateVariant({ sku: e.target.value })}
			/>
		),
		actions: (
			<ScDropdown placement="bottom-end">
				<ScButton type="text" slot="trigger">
					<ScIcon name="more-horizontal" />
				</ScButton>
				<ScMenu>
					<ScMenuItem
						onClick={() =>
							updateVariant({
								status:
									variant?.status === 'draft'
										? 'publish'
										: 'draft',
							})
						}
					>
						{variant?.status === 'draft'
							? __('Restore', 'surecart')
							: __('Delete', 'surecart')}
					</ScMenuItem>
					{!!variant?.image_url && (
						<ScMenuItem onClick={onUnlinkMedia}>
							{__('Remove Image', 'surecart')}
						</ScMenuItem>
					)}
				</ScMenu>
			</ScDropdown>
		),
	};
};
