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
	ScFlex,
	ScIcon,
	ScInput,
	ScMenu,
	ScMenuItem,
	ScPriceInput,
	ScText,
	ScTooltip,
} from '@surecart/components-react';
import Image from './Image';

export default ({ product, updateProduct, variant, updateVariant, prices }) => {
	const { sku, status, image_id, image_url, stock, amount, currency, index } =
		variant;

	const onChangeInput = (e) => {
		const { name, value } = e.target;
		updateVariant([{ name, value }]);
	};

	const onLinkMedia = (media) => {
		updateVariant([
			{ name: 'image_id', value: media?.id },
			{ name: 'image_url', value: media?.url },
		]);
	};

	const onUnlinkMedia = () => {
		const confirmUnlinkMedia = confirm(
			__(
				'Are you sure you wish to unlink this variant image?',
				'surecart'
			)
		);
		if (!confirmUnlinkMedia) return;
		updateVariant([
			{ name: 'image_id', value: null },
			{ name: 'image_url', value: null },
		]);
	};

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
			<ScFlex
				style={{
					'--font-weight': 'var(--sc-font-weight-bold)',
					gap: '1rem',
					justifyContent: 'flex-start',
				}}
				id={`sc_variant_name_${index}`}
			>
				<div
					style={{
						borderRadius: '4px',
						cursor: 'pointer',
					}}
				>
					{image_url ? (
						<div
							css={css`
								position: relative;
								margin-right: 6px;
								padding: var(--sc-spacing-xx-small);
								border: 1px dotted var(--sc-color-gray-400);
							`}
						>
							<img
								src={image_url}
								alt=""
								css={css`
									width: 1.5rem;
									height: 1.5rem;
								`}
							/>
							<ScIcon
								name="trash"
								slot="suffix"
								css={css`
									position: absolute;
									right: -14px;
									top: -12px;
									cursor: pointer;
									opacity: 0.8;
									&:hover {
										opacity: 1;
									}
								`}
								onClick={onUnlinkMedia}
							/>
						</div>
					) : (
						<Image
							variant={variant}
							product={product}
							updateProduct={updateProduct}
							disabled={status === 'draft'}
							existingMediaIds={image_id ? [image_id] : []}
							onAddMedia={(media) => onLinkMedia(media)}
						>
							<ScIcon
								name="image"
								style={{
									color: 'var(--sc-color-gray-400)',
									width: '18px',
									height: '18px',
								}}
							/>
						</Image>
					)}
				</div>

				<ScText
					style={{
						'--font-weight': 'var(--sc-font-weight-bold)',
						flex: 1,
					}}
				>
					{renderName(variant)}
				</ScText>
			</ScFlex>
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
						currency={currency}
						name="amount"
						disabled={status === 'draft'}
						onScChange={onChangeInput}
						id={`sc_variant_amount_${index}`}
					/>
				)}
			</>
		),
		stock: (
			<ScInput
				value={stock ?? 0}
				name="stock"
				disabled={status === 'draft'}
				onScChange={onChangeInput}
				id={`sc_variant_stock_${index}`}
			/>
		),
		sku: (
			<ScInput
				value={sku}
				name="sku"
				disabled={status === 'draft'}
				onScChange={onChangeInput}
				id={`sc_variant_sku_${index}`}
			/>
		),
		actions: (
			<ScDropdown
				placement="bottom-end"
				id={`sc_variant_action_${index}`}
			>
				<ScButton type="text" slot="trigger">
					<ScIcon name="more-horizontal" />
				</ScButton>
				<ScMenu>
					<ScMenuItem
						onClick={() =>
							updateVariant([
								{
									name: 'status',
									value:
										variant?.status === 'draft'
											? 'publish'
											: 'draft',
								},
							])
						}
					>
						{variant?.status === 'draft'
							? __('Restore', 'surecart')
							: __('Delete', 'surecart')}
					</ScMenuItem>
				</ScMenu>
			</ScDropdown>
		),
	};
};
