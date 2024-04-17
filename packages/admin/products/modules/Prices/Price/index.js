/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { store as coreStore } from '@wordpress/core-data';
import { select, useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

import Error from '../../../../components/Error';
// hocs
import Multiple from '../../../components/price/Multiple';
import OneTime from '../../../components/price/OneTime';
import PriceName from '../../../components/price/parts/PriceName';
// components
import Subscription from '../../../components/price/Subscription';
import Header from './Header';
import { ScButton, ScIcon, ScDrawer, ScForm } from '@surecart/components-react';

export default ({ price, product }) => {
	// are the price details open?
	const [isOpen, setIsOpen] = useState(false);
	const [error, setError] = useState(null);
	const [isSaving, setIsSaving] = useState(false);
	const [currentPrice, setCurrentPrice] = useState(price);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const editPrice = (data) => {
		setCurrentPrice({ ...currentPrice, ...data });
	};
	// get any save errors.
	const { savePriceError } = useSelect(
		(select) => {
			if (!currentPrice?.id) return {};
			const entityData = ['surecart', 'price', currentPrice?.id];
			return {
				savePriceError: select(coreStore)?.getLastEntitySaveError?.(
					...entityData
				),
			};
		},
		[currentPrice?.id]
	);

	// dispatchers.
	const { deleteEntityRecord, saveEditedEntityRecord, saveEntityRecord } =
		useDispatch(coreStore);
	const savePrice = (options = {}) =>
		saveEditedEntityRecord('surecart', 'price', currentPrice?.id, options);
	const deletePrice = (options = {}) =>
		deleteEntityRecord('surecart', 'price', currentPrice?.id, {}, options);

	const saveEditedPrice = async () => {
		try {
			setIsSaving(true);
			await saveEntityRecord('surecart', 'price', currentPrice, {
				throwOnError: true,
			});
			setIsOpen(false);
			createSuccessNotice(__('Price saved.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			setIsOpen(false);
			console.error(e);
			setError(e);
		} finally {
			setIsSaving(false);
		}
	};

	// toggle the archive.
	const toggleArchive = async () => {
		const r = confirm(
			currentPrice?.archived
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
			await editPrice({ archived: !currentPrice?.archived });
			await savePrice({ throwOnError: true });
			createSuccessNotice(
				currentPrice?.archived
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
		if (currentPrice?.recurring_interval) {
			if (currentPrice?.recurring_period_count !== null) {
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
					${currentPrice?.archived
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
				price={currentPrice}
				onArchive={toggleArchive}
				variantOptions={product?.variant_options}
				variants={product?.variants}
				stockEnabled={product?.stock_enabled}
				onDelete={onDelete}
				css={css`
					padding: var(--sc-spacing-large);
				`}
				collapsible={true}
			/>

			<Error error={savePriceError || error} setError={setError} />
			<ScForm onScFormSubmit={saveEditedPrice}>
				<ScDrawer
					label={__('Edit Price', 'surecart')}
					style={{ '--sc-drawer-size': '600px' }}
					onScRequestClose={() => setIsOpen(false)}
					open={isOpen}
				>
					<div
						css={css`
							display: flex;
							flex-direction: column;
							height: 100%;
						`}
					>
						<div
							css={css`
								display: grid;
								gap: var(--sc-spacing-medium);
								padding: var(--sc-spacing-x-large);
							`}
						>
							<PriceName
								price={currentPrice}
								updatePrice={editPrice}
							/>

							{getPriceType() === 'subscription' && (
								<Subscription
									price={currentPrice}
									updatePrice={editPrice}
								/>
							)}

							{getPriceType() === 'multiple' && (
								<Multiple
									price={currentPrice}
									updatePrice={editPrice}
								/>
							)}

							{getPriceType() === 'once' && (
								<OneTime
									price={currentPrice}
									updatePrice={editPrice}
								/>
							)}
						</div>
					</div>
					<div
						css={css`
							display: flex;
							justify-content: space-between;
						`}
						slot="footer"
					>
						<div>
							<ScButton
								type="primary"
								submit
								isBusy={isSaving}
								disabled={isSaving}
							>
								{__('Update Price', 'surecart')}
							</ScButton>
							<ScButton
								type="text"
								onClick={() => {
									setCurrentPrice(price);
									setIsOpen(false);
								}}
							>
								{__('Cancel', 'surecart')}
							</ScButton>
						</div>
						<div
							css={css`
								align-content: center;
							`}
						>
							{product?.tax_enabled &&
								scData?.tax_protocol?.tax_enabled &&
								scData?.tax_protocol?.tax_behavior ===
									'inclusive' && (
									<span
										css={css`
											text-align: right;
										`}
									>
										<ScButton
											size="small"
											type="text"
											target="_blank"
											href="admin.php?page=sc-settings&tab=tax_protocol"
										>
											{__('Tax is included', 'surecart')}
											<ScIcon
												name="external-link"
												slot="suffix"
											/>
										</ScButton>
									</span>
								)}
						</div>
					</div>
					{isSaving && <sc-block-ui spinner></sc-block-ui>}
				</ScDrawer>
			</ScForm>
		</div>
	);
};
