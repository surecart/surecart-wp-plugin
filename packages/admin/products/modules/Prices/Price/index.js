/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

import Error from '../../../../components/Error';
// hocs
import Multiple from '../../../components/price/Multiple';
import OneTime from '../../../components/price/OneTime';
import PriceName from '../../../components/price/parts/PriceName';
// components
import Tax from '../../../components/price/parts/Tax';
import Subscription from '../../../components/price/Subscription';
import Header from './Header';

export default ({ price, product }) => {
	// are the price details open?
	const [isOpen, setIsOpen] = useState(false);
	const [error, setError] = useState(null);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const { savingPrice, deletingPrice, savePriceError } = useSelect(
		(select) => {
			if (!price?.id) return {};
			const entityData = ['surecart', 'price', price?.id];
			return {
				savingPrice: select(coreStore)?.isSavingEntityRecord?.(
					...entityData
				),
				savePriceError: select(coreStore)?.getLastEntitySaveError?.(
					...entityData
				),
				deletingPrice: select(coreStore)?.isDeletingEntityRecord?.(
					...entityData
				),
			};
		},
		[price?.id]
	);

	// dispatchers.
	const { editEntityRecord, deleteEntityRecord, saveEditedEntityRecord } =
		useDispatch(coreStore);
	const savePrice = (options = {}) =>
		saveEditedEntityRecord('surecart', 'price', price?.id, options);
	const deletePrice = (options = {}) =>
		deleteEntityRecord('surecart', 'price', price?.id, {}, options);
	const editPrice = (data) =>
		editEntityRecord('surecart', 'price', price?.id, data);

	// toggle the archive.
	const toggleArchive = async () => {
		const r = confirm(
			price?.archived
				? __(
						'Un-Archive this price? This will make the product purchaseable again.',
						'surecart'
				  )
				: __(
						'Archive this price? This product will not be purchaseable and all unsaved changes will be lost.',
						'surecart'
				  )
		);
		if (!r) return;

		try {
			await editPrice({ archived: !price?.archived });
			await savePrice({ throwOnError: true });
			createSuccessNotice(
				price?.archived
					? __('Price unarchived.', 'surecart')
					: __('Price archived.'),
				{
					type: 'snackbar',
				}
			);
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	/**
	 * Toggle product delete.
	 */
	const onDelete = async () => {
		const r = confirm(
			__(
				'Permanently delete this price? You cannot undo this action.',
				'surecart'
			)
		);
		if (!r) return;

		try {
			setError(null);
			await deletePrice({ throwOnError: true });
			createSuccessNotice(__('Price deleted.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	// get the price type.
	const getPriceType = () => {
		if (price?.recurring_interval) {
			if (price?.recurring_period_count !== null) {
				return 'multiple';
			}
			return 'subscription';
		}
		return 'once';
	};

	return (
		<div
			css={css`
				border: 1px solid
					${price?.archived
						? 'var(--sc-color-warning-300)'
						: 'var(--sc-color-gray-300)'};
				border-radius: var(--sc-border-radius-medium);
				box-shadow: var(--sc-shadow-small);
				display: grid;
				background: #fff;
			`}
		>
			<Header
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				price={price}
				onArchive={toggleArchive}
				onDelete={onDelete}
				css={css`
					padding: var(--sc-spacing-large);
				`}
				collapsible={true}
			/>

			<Error error={savePriceError || error} setError={setError} />

			<div
				css={css`
					gap: var(--sc-form-row-spacing);
					border-top: 1px solid var(--sc-color-gray-300);
					padding: var(--sc-spacing-large);
					background: ${price?.archived
						? 'var(--sc-color-warning-50)'
						: 'var(--sc-color-gray-50)'};
					display: ${isOpen ? 'grid' : 'none'};
				`}
			>
				<PriceName price={price} updatePrice={editPrice} />

				{getPriceType() === 'subscription' && (
					<Subscription price={price} updatePrice={editPrice} />
				)}

				{getPriceType() === 'multiple' && (
					<Multiple price={price} updatePrice={editPrice} />
				)}

				{getPriceType() === 'once' && (
					<OneTime price={price} updatePrice={editPrice} />
				)}

				<Tax
					style={{
						marginTop: '0.5em',
						display: 'inline-block',
					}}
					price={price}
					product={product}
					updatePrice={editPrice}
				/>
			</div>

			{(savingPrice || deletingPrice) && (
				<sc-block-ui spinner></sc-block-ui>
			)}
		</div>
	);
};
