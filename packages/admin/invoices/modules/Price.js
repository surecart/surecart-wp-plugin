/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScFlex,
	ScFormatNumber,
	ScIcon,
	ScTableCell,
	ScTableRow,
	ScDialog,
	ScPriceInput,
	ScForm,
	ScVisuallyHidden,
	ScText,
	ScInput,
} from '@surecart/components-react';
import {
	getFeaturedProductMediaAttributes,
	getMaxStockQuantity,
} from '@surecart/components';
import { intervalString } from '../../util/translations';
import { useInvoice } from '../hooks/useInvoice';
import LineItemLabel from '../../ui/LineItemLabel';
import LineItemNote from './LineItemNote';
import { Button } from '@wordpress/components';

export default ({
	price,
	fees,
	quantity,
	onRemove,
	onChange,
	subtotal_amount,
	ad_hoc_amount,
	lineItem,
}) => {
	const { isDraftInvoice, busy } = useInvoice();
	const media = getFeaturedProductMediaAttributes(price?.product);
	const [open, setOpen] = useState(false);
	const maxStockQuantity = getMaxStockQuantity(
		price?.product,
		lineItem?.variant
	);
	const [addHocAmount, setAddHocAmount] = useState(
		ad_hoc_amount || price?.amount
	);

	useEffect(() => {
		setAddHocAmount(ad_hoc_amount || price?.amount);
	}, [ad_hoc_amount, price]);

	const renderQuantityInput = () => {
		if (!isDraftInvoice) {
			return quantity;
		}

		return (
			<ScInput
				type="number"
				value={quantity}
				disabled={price?.ad_hoc || busy}
				onScChange={(e) =>
					onChange({
						quantity: parseInt(e.target.value),
					})
				}
				{...(maxStockQuantity && { max: maxStockQuantity })}
			/>
		);
	};

	return (
		<ScTableRow>
			<ScTableCell>
				<ScFlex alignItems="flex-start" justifyContent="flex-start">
					{media?.url ? (
						<img
							src={media.url}
							alt={media.alt}
							{...(media.title ? { title: media.title } : {})}
							css={css`
								width: var(
									--sc-product-line-item-image-size,
									4em
								);
								min-width: var(
									--sc-product-line-item-image-size,
									4em
								);
								height: var(
									--sc-product-line-item-image-size,
									4em
								);
								object-fit: cover;
								border-radius: 4px;
								border: solid 1px
									var(
										--sc-input-border-color,
										var(--sc-input-border)
									);
								display: block;
								box-shadow: var(--sc-input-box-shadow);
								align-self: flex-start;
							`}
						/>
					) : (
						<div
							css={css`
								width: var(
									--sc-product-line-item-image-size,
									4em
								);
								min-width: var(
									--sc-product-line-item-image-size,
									4em
								);
								height: var(
									--sc-product-line-item-image-size,
									4em
								);
								object-fit: cover;
								background: var(--sc-color-gray-100);
								display: flex;
								align-items: center;
								justify-content: center;
								border-radius: 4px;
								border: solid 1px
									var(
										--sc-input-border-color,
										var(--sc-input-border)
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
					<div
						css={css`
							flex: 1;
							display: flex;
							flex-direction: column;
							gap: 2px;
						`}
					>
						<strong>{price?.product?.name}</strong>

						<LineItemLabel
							lineItem={lineItem}
							showPriceName={false}
						/>

						<LineItemNote
							lineItem={lineItem}
							onChange={onChange}
							isDraftInvoice={isDraftInvoice}
							busy={busy}
						/>
					</div>
				</ScFlex>
			</ScTableCell>

			<ScTableCell>
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-bottom: var(--sc-spacing-small);
					`}
				>
					<div>
						<ScFormatNumber
							type="currency"
							currency={price?.currency || 'usd'}
							value={
								!!price?.ad_hoc && ad_hoc_amount
									? ad_hoc_amount
									: price?.amount
							}
						/>
						{intervalString(price)}
					</div>

					{!!price?.ad_hoc && isDraftInvoice && (
						<Button
							label={__('Change Amount', 'surecart')}
							variant="tertiary"
							type="button"
							onClick={() => setOpen(true)}
							style={{
								color: 'var(--sc-color-gray-500)',
							}}
						>
							<ScIcon name="edit" />
						</Button>
					)}
				</div>

				{!!price?.trial_duration_days && (
					<div
						css={css`
							opacity: 0.65;
							font-size: 12px;
							line-height: 1.2;
						`}
					>
						{sprintf(
							_n(
								'Starting in %s day',
								'Starting in %s days',
								price.trial_duration_days,
								'surecart'
							),
							price.trial_duration_days
						)}
					</div>
				)}

				{!!fees?.length && (
					<div>
						{(fees || []).map(({ description, amount }) => {
							return (
								<div
									css={css`
										opacity: 0.65;
										font-size: 12px;
										line-height: 1.2;
									`}
								>
									<ScFormatNumber
										type="currency"
										currency={price?.currency || 'usd'}
										value={amount}
									/>{' '}
									{description || __('Fee', 'surecart')}
								</div>
							);
						})}
					</div>
				)}
			</ScTableCell>
			<ScTableCell>
				{isDraftInvoice ? (
					<ScInput
						type="number"
						value={quantity}
						disabled={price?.ad_hoc || busy}
						onScChange={(e) =>
							onChange({
								quantity: parseInt(e.target.value),
							})
						}
						{...(maxStockQuantity && { max: maxStockQuantity })}
					/>
				) : (
					quantity
				)}

				{isDraftInvoice && maxStockQuantity && (
					<ScText
						css={css`
							margin-top: var(--sc-spacing-small);
							color: var(
								--sc-price-label-color,
								var(--sc-input-help-text-color)
							);
							font-size: var(
								--sc-price-label-font-size,
								var(--sc-input-help-text-font-size-medium)
							);
						`}
					>
						{sprintf(
							__('Available: %d', 'surecart'),
							maxStockQuantity
						)}
					</ScText>
				)}
			</ScTableCell>
			<ScTableCell>
				<div
					css={css`
						display: grid;
						gap: 0.5em;
					`}
				>
					<div
						css={css`
							display: flex;
							gap: 10px;
							align-items: center;
						`}
					>
						<ScFormatNumber
							type="currency"
							currency={price?.currency || 'usd'}
							value={
								!!price?.ad_hoc && ad_hoc_amount
									? ad_hoc_amount
									: subtotal_amount
							}
						/>
					</div>
				</div>
			</ScTableCell>
			{isDraftInvoice && (
				<ScTableCell
					css={css`
						text-align: right;
					`}
				>
					<ScButton onClick={onRemove} type="text" circle>
						<ScIcon name="trash" />
						<ScVisuallyHidden>
							{__('Remove', 'surecart')}
						</ScVisuallyHidden>
					</ScButton>
				</ScTableCell>
			)}
			<ScForm
				onScFormSubmit={(e) => {
					if (!isDraftInvoice) {
						return;
					}

					e.stopImmediatePropagation(); // prevents the page form from submitting.
					setOpen(false);
					onChange({ ad_hoc_amount: addHocAmount });
					setAddHocAmount(false);
				}}
			>
				<ScDialog
					label={__('Change Amount', 'surecart')}
					open={open}
					style={{ '--dialog-body-overflow': 'visible' }}
					onScRequestClose={() => setOpen(false)}
				>
					<ScPriceInput
						label={__('Amount', 'surecart')}
						placeholder={__('Enter an Amount', 'surecart')}
						currencyCode={price?.currency}
						value={addHocAmount}
						min={price?.ad_hoc_min_amount}
						max={price?.ad_hoc_max_amount}
						onScInput={(e) => {
							setAddHocAmount(parseInt(e?.target?.value));
						}}
						required
						{...(!isDraftInvoice && { disabled: true })}
					/>
					<ScButton slot="footer" type="primary" submit>
						{__('Update', 'surecart')}
					</ScButton>
					<ScButton
						slot="footer"
						type="text"
						onClick={() => setOpen(false)}
					>
						{__('Cancel', 'surecart')}
					</ScButton>
				</ScDialog>
			</ScForm>
		</ScTableRow>
	);
};
