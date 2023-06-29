/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import { intervalString } from '../../util/translations';
import { useState } from '@wordpress/element';
import {
	ScButton,
	ScFlex,
	ScFormatNumber,
	ScInput,
	ScStackedListRow,
	ScIcon,
	ScTable,
	ScTableCell,
	ScTableRow,
	ScQuantitySelect,
	ScDialog,
	ScPriceInput,
	ScBlockUi
} from '@surecart/components-react';

import { store as noticesStore } from '@wordpress/notices';
import { store as coreStore } from '@wordpress/core-data';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useDispatch, select, useSelect } from '@wordpress/data';
import expand from '../query';

export default ({ price, quantity, onRemove, onQuantityChange, full_amount, checkout }) => {
	const imageUrl = price?.product?.image_url;
	const [open, setOpen] = useState(false);
	const [addHocAmount, setAddHocAmount] = useState(price?.amount);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);
	const [addHocAmountLoading, setAddHocAmountLoading] = useState(false);
console.log(checkout);
	const onUpdateAdHocAmount = async (e) => {
		e.preventDefault();
		
		try {
			setAddHocAmountLoading(true);

			// get the line items endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'line_item'
			);

			// add the line item.
			const { checkout: data } = await apiFetch({
				method: 'POST',
				path: addQueryArgs(baseURL, {
					expand: [
						// expand the checkout and the checkout's required expands.
						...(expand || []).map((item) => {
							return item.includes('.')
								? item
								: `checkout.${item}`;
						}),
						'checkout',
					],
				}),
				data: {
					checkout: checkout?.id,
					price: price?.id,
					quantity: 1,
					ad_hoc_amount: addHocAmount
				},
			});

			// update the checkout in the redux store.
			receiveEntityRecords(
				'surecart',
				'checkout',
				data,
				undefined,
				false,
				checkout
			);

			createSuccessNotice(__('Amount updated.', 'surecart'), {
				type: 'snackbar',
			});

			setOpen(false);
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong.', 'surecart'),
				{
					type: 'snackbar',
				}
			);
		} finally {
			setAddHocAmountLoading(false);
		}
	};

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
									border-radius: var(--sc-border-radius-small);
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
									border-radius: var(--sc-border-radius-small);
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
								value={price?.ad_hoc_amount ? price?.ad_hoc_amount : price?.amount}
							/>
							{intervalString(price)}
						</div>
					</ScFlex>
				</ScTableCell>
				<ScTableCell style={{ textAlign: 'center' }}>
				{
					!!price?.ad_hoc ? (
						__('--', 'surecart')
					) : (
						<ScQuantitySelect
							quantity={quantity}
							onScChange={(e) => onQuantityChange(e.detail)}
						/>
					)
				}
				</ScTableCell>
				<ScTableCell style={{ textAlign: 'center' }}>
					<div css={css`display: flex; gap: 10px; align-items:center; ${price?.ad_hoc ?'justify-content: center;' : 'padding-left: 17px;'}`}>
					<ScFormatNumber
						type="currency"
						currency={price?.currency || 'usd'}
						value={ full_amount }
					/>
					{
						!!price?.ad_hoc && (
							<ScButton size="small" onClick={() => setOpen(true)}>
								<ScIcon name="edit" />
							</ScButton>
						)
					}
					</div>
				</ScTableCell>
				<ScTableCell>
					<ScButton size="small" onClick={onRemove}>
						{__('Remove', 'surecart')}
					</ScButton>
				</ScTableCell>
			</ScTableRow>
			<ScDialog
				label={__('Change Amount', 'surecart')}
				open={open}
				style={{ '--dialog-body-overflow': 'visible' }}
				onScRequestClose={() => setOpen(false)}
			>
				
				<ScPriceInput
					label={__('Amount', 'surecart')}
					placeholder={__('Enter an Amount', 'surecart')}
					style={{ flex: 1 }}
					currencyCode={ price?.currency }
					value={addHocAmount || price?.amount || null}
					onScInput={(e) => {
						setAddHocAmount(e.target.value);
					}}
				/>
				<ScButton
					type="primary"
					onClick={(e) => {
						onUpdateAdHocAmount(e);
					}}
					style={{
						marginTop: '17.5px'
					}}
				>
					{__('Update', 'surecart')}
				</ScButton>
				{(!!addHocAmountLoading ) && (
				<ScBlockUi spinner />
			)}
			</ScDialog>
		</>
	);
};
