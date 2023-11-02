/** @jsx jsx */
import { __, _n, sprintf } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import { intervalString } from '../../util/translations';
import { useEffect, useState } from '@wordpress/element';
import {
	ScButton,
	ScFlex,
	ScFormatNumber,
	ScIcon,
	ScTableCell,
	ScTableRow,
	ScQuantitySelect,
	ScDialog,
	ScPriceInput,
	ScForm,
} from '@surecart/components-react';
import LineItemLabel from '../../ui/LineItemLabel';

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
	const imageUrl = price?.product?.image_url;
	const [open, setOpen] = useState(false);
	const [addHocAmount, setAddHocAmount] = useState(
		ad_hoc_amount || price?.amount
	);

	useEffect(() => {
		setAddHocAmount(ad_hoc_amount || price?.amount);
	}, [ad_hoc_amount, price]);

	return (
		<>
			<ScTableRow>
				<ScTableCell>
					<ScFlex alignItems="center" justifyContent="flex-start">
						{imageUrl ? (
							<img
								src={imageUrl}
								css={css`
									width: var(
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
									-webkit-align-self: flex-start;
									-ms-flex-item-align: start;
									align-self: flex-start;
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
								<LineItemLabel lineItem={lineItem}>
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
								</LineItemLabel>
							</div>
						</div>
					</ScFlex>
				</ScTableCell>
				<ScTableCell>
					{!!price?.ad_hoc ? (
						__('--', 'surecart')
					) : (
						<ScQuantitySelect
							quantity={quantity}
							onScChange={(e) => onChange({ quantity: e.detail })}
						/>
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
							{!!price?.ad_hoc && (
								<ScButton
									size="small"
									onClick={() => setOpen(true)}
								>
									<ScIcon name="edit" />
								</ScButton>
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
												currency={
													price?.currency || 'usd'
												}
												value={amount}
											/>{' '}
											{description ||
												__('Fee', 'surecart')}
										</div>
									);
								})}
							</div>
						)}
					</div>
				</ScTableCell>
				<ScTableCell
					css={css`
						text-align: right;
					`}
				>
					<ScButton size="small" onClick={onRemove}>
						{__('Remove', 'surecart')}
					</ScButton>
				</ScTableCell>
				<ScForm
					onScFormSubmit={(e) => {
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
		</>
	);
};
