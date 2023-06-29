/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import { intervalString } from '../../util/translations';
import { useState } from '@wordpress/element';
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

export default ({ price, quantity, onRemove, onChange, full_amount }) => {
	const imageUrl = price?.product?.image_url;
	const [open, setOpen] = useState(false);
	const [addHocAmount, setAddHocAmount] = useState(price?.amount);

	return (
		<>
			<ScTableRow>
				<ScTableCell>
					<ScFlex alignItems="center" justifyContent="flex-start">
						{imageUrl ? (
							<img
								src={imageUrl}
								css={css`
									width: 40px;
									height: 40px;
									object-fit: cover;
									background: #f3f3f3;
									display: flex;
									align-items: center;
									justify-content: center;
									border-radius: var(
										--sc-border-radius-small
									);
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
							</div>
							<ScFormatNumber
								type="currency"
								currency={price?.currency || 'usd'}
								value={
									price?.ad_hoc_amount
										? price?.ad_hoc_amount
										: price?.amount
								}
							/>
							{intervalString(price)}
						</div>
					</ScFlex>
				</ScTableCell>
				<ScTableCell style={{ textAlign: 'center' }}>
					{!!price?.ad_hoc ? (
						__('--', 'surecart')
					) : (
						<ScQuantitySelect
							quantity={quantity}
							onScChange={(e) => onChange({ quantity: e.detail })}
						/>
					)}
				</ScTableCell>
				<ScTableCell style={{ textAlign: 'center' }}>
					<div
						css={css`
							display: flex;
							gap: 10px;
							align-items: center;
							${price?.ad_hoc
								? 'justify-content: center;'
								: 'padding-left: 17px;'}
						`}
					>
						<ScFormatNumber
							type="currency"
							currency={price?.currency || 'usd'}
							value={full_amount}
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
				</ScTableCell>
				<ScTableCell>
					<ScButton size="small" onClick={onRemove}>
						{__('Remove', 'surecart')}
					</ScButton>
				</ScTableCell>
			</ScTableRow>

			<ScForm
				onScFormSubmit={(e) => {
					e.stopImmediatePropagation(); // prevents the page form from submitting.
					setOpen(false);
					onChange({ ad_hoc_amount: addHocAmount });
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
						value={addHocAmount || price?.amount || null}
						onScInput={(e) => setAddHocAmount(e.target.value)}
						required
					/>
					<ScButton slot="footer" type="primary" submit>
						{__('Update', 'surecart')}
					</ScButton>
					<ScButton slot="footer" type="text">
						{__('Cancel', 'surecart')}
					</ScButton>
				</ScDialog>
			</ScForm>
		</>
	);
};
