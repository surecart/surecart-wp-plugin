/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { store as coreStore, useEntityRecord } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { useRef, useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { ScButton, ScIcon, ScDrawer, ScForm } from '@surecart/components-react';

import Error from '../../../../components/Error';
// hocs
import Multiple from '../../../components/price/Multiple';
import OneTime from '../../../components/price/OneTime';
import PriceName from '../../../components/price/parts/PriceName';
// components
import Subscription from '../../../components/price/Subscription';
import Header from './Header';
import Swap from '../../../components/price/parts/Swap';
import Advanced from '../../../components/price/parts/Advanced';
import PaymentType from '../../../components/price/parts/PaymentType';

export default ({ price, product, allPrices }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [error, setError] = useState(null);
	const [isSaving, setIsSaving] = useState(false);
	const [currentPrice, setCurrentPrice] = useState(price);
	const [currentSwap, setCurrentSwap] = useState(null);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { record: swap } = useEntityRecord(
		'surecart',
		'swap',
		price?.current_swap
	);
	const ref = useRef(null);
	const {
		deleteEntityRecord,
		saveEntityRecord,
		invalidateResolutionForStore,
		receiveEntityRecords,
	} = useDispatch(coreStore);
	const editPrice = (data) => {
		setCurrentPrice({ ...currentPrice, ...data });
	};
	const editSwap = (data) => {
		setCurrentSwap({ ...currentSwap, ...data });
	};

	// make sure current price stays up to date with changes.
	useEffect(() => {
		setCurrentPrice(price);
	}, [price]);

	useEffect(() => {
		setCurrentSwap(swap);
	}, [swap]);

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

	const saveEditedPrice = async (e) => {
		e.stopPropagation();
		try {
			setIsSaving(true);
			await saveEntityRecord('surecart', 'price', currentPrice, {
				throwOnError: true,
			});

			if (currentSwap) {
				await saveEntityRecord('surecart', 'swap', currentSwap, {
					throwOnError: true,
				});
			}

			await invalidateResolutionForStore();
			setIsOpen(false);
			createSuccessNotice(__('Price updated.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
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
			await saveEntityRecord(
				'surecart',
				'price',
				{
					...currentPrice,
					archived: !currentPrice?.archived,
				},
				{ throwOnError: true }
			);

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
			await deleteEntityRecord(
				'surecart',
				'price',
				currentPrice?.id,
				null,
				{ throwOnError: true }
			);
			await invalidateResolutionForStore(); // invalidate the resolution for the store to refresh the prices.
			createSuccessNotice(__('Price deleted.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	const onDuplicate = async (duplicate) => {
		await receiveEntityRecords(
			'surecart',
			'price',
			[...(allPrices || []), duplicate],
			{ context: 'edit', product_ids: [product?.id], per_page: 100 }
		);
		createSuccessNotice(__('Price duplicated.', 'surecart'), {
			type: 'snackbar',
		});
		await invalidateResolutionForStore(); // invalidate the resolution for the store to refresh the prices.
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
				padding: 28px;
				background: ${currentPrice?.archived
					? 'var(--sc-color-warning-50)'
					: 'white'};
				border-bottom: 1px solid var(--sc-color-gray-200);
				border-top: 1px solid var(--sc-color-gray-200);
				margin-top: -1px;
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
				onDuplicate={onDuplicate}
				collapsible={true}
			/>

			<Error error={savePriceError || error} setError={setError} />

			<ScForm onScFormSubmit={saveEditedPrice}>
				<ScDrawer
					label={__('Edit Price', 'surecart')}
					style={{
						'--sc-drawer-size': '38rem',
						'--sc-input-label-margin': 'var(--sc-spacing-small)',
					}}
					onScRequestClose={() => setIsOpen(false)}
					open={isOpen}
					onScAfterShow={() => ref.current.triggerFocus()}
					stickyHeader
				>
					<div
						css={css`
							display: flex;
							flex-direction: column;
							height: 100%;
							background: var(--sc-color-gray-50);
						`}
					>
						<div
							css={css`
								padding: 30px;
								display: grid;
								gap: 2em;
							`}
						>
							<Error error={error} setError={setError} />

							<PriceName
								price={currentPrice}
								updatePrice={editPrice}
								ref={ref}
							/>

							<PaymentType
								type={getPriceType()}
								price={currentPrice}
								updatePrice={editPrice}
							/>

							{getPriceType() === 'subscription' && (
								<Subscription
									price={currentPrice}
									updatePrice={editPrice}
									product={product}
								/>
							)}

							{getPriceType() === 'multiple' && (
								<Multiple
									price={currentPrice}
									updatePrice={editPrice}
									product={product}
								/>
							)}

							{getPriceType() === 'once' && (
								<OneTime
									price={currentPrice}
									updatePrice={editPrice}
									product={product}
								/>
							)}

							{!product?.variants?.length &&
								!product?.variants?.data?.length &&
								!currentPrice?.ad_hoc && (
									<Swap
										currentPrice={currentPrice}
										updateSwap={editSwap}
										currentSwap={currentSwap}
										isSaving={isSaving}
										currentProduct={product}
									/>
								)}

							<Advanced
								price={currentPrice}
								updatePrice={editPrice}
								product={product}
							/>
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
