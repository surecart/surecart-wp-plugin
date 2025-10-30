/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState } from 'react';
/**
 * External dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScDropdown,
	ScFormControl,
	ScIcon,
	ScInput,
	ScMenu,
	ScMenuItem,
	ScPriceInput,
	ScQuantitySelect,
	ScMenuDivider,
	ScTooltip,
} from '@surecart/components-react';
import Image from './Image';
import EditVariant from './EditVariant';

export default ({
	variant,
	product,
	updateVariant,
	defaultAmount,
	defaultSku,
	canOverride,
	quantityEnabled,
	variantOptions,
}) => {
	const {
		sku,
		status,
		stock,
		available_stock,
		stock_adjustment,
		amount,
		currency,
	} = variant;

	/**
	 * Edit variant.
	 */
	const [edit, setEdit] = useState(false);

	/**
	 * Link media.
	 */
	const onLinkMedia = (media) =>
		updateVariant({
			metadata: { ...(variant.metadata || []), wp_media: media?.[0]?.id },
		});

	/**
	 * Unlink Media
	 */
	const onUnlinkMedia = () => {
		const confirmUnlinkMedia = confirm(
			__('Are you sure you wish to unlink this image?', 'surecart')
		);
		if (!confirmUnlinkMedia) return;
		updateVariant({
			image_id: null, // backwards compatibility.
			image_url: null, // backwards compatibility.
			image: null, // backwards compatibility.
			metadata: { ...(variant.metadata || []), wp_media: null },
		});
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
			<Tag
				style={colorStyle}
				css={css`
					word-break: break-word;
				`}
			>
				{option_1}
				{!!option_2?.length && ' / '}
				{option_2}
				{!!option_3?.length && ' / '}
				{option_3}
			</Tag>
		);
	};

	return (
		<>
			<td class="variant-image">
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
			</td>
			<td class="variant-price">
				<>
					{!canOverride ? (
						<ScTooltip
							type="text"
							text={__(
								'Price overrides are only allowed for products with a single price.',
								'surecart'
							)}
						>
							<div
								css={css`
									width: 30px;
									display: inline-block;
								`}
							>
								-
							</div>
						</ScTooltip>
					) : (
						<ScPriceInput
							type="number"
							min="0"
							value={amount}
							placeholder={defaultAmount}
							currencyCode={
								currency || window?.scData?.currency_code
							}
							css={css`
								min-width: 100px;
							`}
							disabled={status === 'draft'}
							onScInput={(e) =>
								updateVariant({ amount: e.target.value })
							}
						/>
					)}
				</>
			</td>
			{quantityEnabled && (
				<td class="variant-quantity">
					<ScDropdown placement="bottom-end">
						<ScButton
							type="text"
							slot="trigger"
							css={css`
								min-width: 70px;
								color: var(--sc-color-gray-700);
							`}
							caret
						>
							{sprintf(
								__('%d Available', 'surecart'),
								(available_stock || 0) + (stock_adjustment || 0)
							)}
						</ScButton>
						<ScMenu>
							<div
								css={css`
									padding: var(--sc-spacing-xx-small)
										var(--sc-spacing-medium);
									display: grid;
									gap: var(--sc-spacing-small);
								`}
							>
								<ScFormControl
									label={__('Adjust By', 'surecart')}
								>
									<ScQuantitySelect
										css={css`
											box-sizing: border-box;
											--sc-quantity-input-max-width: 80px;
											--sc-quantity-select-width: 145px;
										`}
										quantity={stock_adjustment || 0}
										onScInput={(e) =>
											updateVariant({
												stock_adjustment: e.detail,
											})
										}
										min={-9999999}
										name="stock"
									/>
								</ScFormControl>
								<ScFormControl
									label={__('Available', 'surecart')}
								>
									<ScQuantitySelect
										css={css`
											box-sizing: border-box;
											--sc-quantity-input-max-width: 80px;
											--sc-quantity-select-width: 145px;
										`}
										quantity={
											(available_stock || 0) +
											(stock_adjustment || 0)
										}
										onScInput={(e) =>
											updateVariant({
												stock_adjustment:
													e.detail -
													(available_stock || 0),
											})
										}
										min={-9999999}
										name="stock"
									/>
								</ScFormControl>
								<ScFormControl
									label={__('On Hand', 'surecart')}
								>
									<ScQuantitySelect
										css={css`
											box-sizing: border-box;
											--sc-quantity-input-max-width: 80px;
											--sc-quantity-select-width: 145px;
										`}
										quantity={
											(stock || 0) +
											(stock_adjustment || 0)
										}
										onScInput={(e) =>
											updateVariant({
												stock_adjustment:
													e.detail - (stock || 0),
											})
										}
										min={-9999999}
										name="stock"
									/>
								</ScFormControl>
							</div>
						</ScMenu>
					</ScDropdown>
				</td>
			)}
			<td class="variant-sku">
				<ScInput
					value={sku}
					placeholder={defaultSku}
					css={css`
						min-width: 100px;
					`}
					disabled={status === 'draft'}
					onScInput={(e) => updateVariant({ sku: e.target.value })}
				/>
			</td>
			<td>
				<ScDropdown placement="bottom-end">
					<ScButton
						type="text"
						slot="trigger"
						aria-label={__('Open variant dropdown', 'surecart')}
					>
						<ScIcon name="more-horizontal" />
					</ScButton>
					<ScMenu>
						<ScMenuItem
							aria-label={__('Edit variant', 'surecart')}
							onClick={() => setEdit(true)}
						>
							{__('Edit more...', 'surecart')}
						</ScMenuItem>
						<ScMenuDivider />
						<ScMenuItem
							aria-label={__('Delete variant', 'surecart')}
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
							<ScMenuItem
								onClick={onUnlinkMedia}
								aria-label={__('Remove image', 'surecart')}
							>
								{__('Remove Image', 'surecart')}
							</ScMenuItem>
						)}
					</ScMenu>
				</ScDropdown>
			</td>
			{edit && (
				<EditVariant
					variant={variant}
					product={product}
					updateVariant={updateVariant}
					variantOptions={variantOptions}
					onRequestClose={() => setEdit(false)}
				/>
			)}
		</>
	);
};
