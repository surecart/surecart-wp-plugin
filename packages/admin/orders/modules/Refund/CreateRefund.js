/** @jsx jsx   */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useEffect } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScAlert,
	ScButton,
	ScForm,
	ScLineItem,
	ScPriceInput,
	ScSelect,
	ScIcon,
	ScDrawer,
	ScInput,
	ScCheckbox,
	ScFormatNumber,
	ScText,
} from '@surecart/components-react';
import Error from '../../../components/Error';
import Box from '../../../ui/Box';
import useRefund from '../../hooks/useRefund';
import { refundResasonOptions } from '../../../util/refunds';

export default ({ charge, onRequestClose, onRefunded }) => {
	const checkoutId = charge?.checkout?.id ?? charge?.checkout;
	const [loading, setLoading] = useState(false);
	const [amount, setAmount] = useState(
		charge?.amount - charge?.refunded_amount
	);
	const [totalQuantity, setTotalQuantity] = useState(0);
	const [reason, setReason] = useState('requested_by_customer');
	const [error, setError] = useState(null);
	const { refunds, loading: fetchingRefunds } = useRefund(charge?.id);

	const { saveEntityRecord, invalidateResolutionForStore } =
		useDispatch(coreStore);
	const { purchases, fetchingPurchases } = useSelect(
		(select) => {
			if (!checkoutId) {
				return {
					purchases: [],
					loading: true,
				};
			}
			const entityData = [
				'surecart',
				'purchase',
				{
					checkout_ids: checkoutId ? [checkoutId] : null,
					expand: ['product', 'line_item', 'line_item.price'],
				},
			];
			return {
				purchases: select(coreStore)?.getEntityRecords?.(...entityData),
				loading: !select(coreStore)?.hasFinishedResolution?.(
					'getEntityRecords',
					[...entityData]
				),
			};
		},
		[checkoutId]
	);

	const [items, setItems] = useState([]);
	const getRefundedItem = (purchaseItem) => {
		for (const refund of refunds || []) {
			const refundItem = refund?.refund_items?.data?.find(
				(item) => item?.line_item?.id === purchaseItem?.id
			);
			if (refundItem) {
				return refundItem;
			}
		}
		return {};
	};

	const totalRefundedQuantity = (refunds ?? []).reduce(
		(totalQuantity, refund) => {
			const refundItemsQuantity = (
				refund.refund_items?.data ?? []
			).reduce((subtotalQuantity, item) => {
				return subtotalQuantity + (item?.quantity || 0);
			}, 0);
			return totalQuantity + refundItemsQuantity;
		},
		0
	);

	const totalPurchaseQuantity = (purchases ?? []).reduce(
		(totalQuantity, purchase) => {
			return totalQuantity + (purchase?.quantity || 0);
		},
		0
	);

	const refundedMessage =
		totalRefundedQuantity !== totalPurchaseQuantity
			? __(
					'Some items in this order have been removed or added to a return.',
					'surecart'
			  )
			: __('All items in this order have been refunded.', 'surecart');

	useEffect(() => {
		setItems(
			(purchases || [])
				.filter(({ id, quantity, ...item }) => {
					const lineItem = item.line_items?.data?.[0];
					const qtyRefunded =
						getRefundedItem(lineItem)?.quantity || 0;
					return quantity - qtyRefunded > 0;
				})
				.map(({ id, quantity, ...item }) => {
					const lineItem = item.line_items?.data?.[0];
					const refundedItem = getRefundedItem(lineItem);
					const qtyRefunded = refundedItem?.quantity || 0;
					return {
						...item,
						id,
						quantity: 0,
						originalQuantity: quantity - qtyRefunded,
						revokePurchase: refundedItem?.revoke_purchase || true,
						restock: refundedItem?.restock || false,
						lineItem,
					};
				})
		);
	}, [purchases, refunds]);

	// On change individual amount, update the setAmount.
	useEffect(() => {
		const totalAmount = items.reduce((total, item) => {
			return total + item.quantity * item.lineItem?.price?.amount;
		}, 0);
		setAmount(
			Math.min(totalAmount, charge?.amount - charge?.refunded_amount)
		);

		const totalQuantity = items.reduce((total, item) => {
			return total + item.quantity;
		}, 0);
		setTotalQuantity(totalQuantity);
	}, [items]);

	/**
	 * Handle submit.
	 */
	const onSubmit = async (e) => {
		setError(false);
		setLoading(true);

		try {
			const refund = await saveEntityRecord(
				'surecart',
				'refund',
				{
					amount,
					reason,
					charge: charge?.id,
					refund_items: items
						.filter((item) => item.quantity > 0)
						.map((item) => ({
							purchase: item.id,
							quantity: item.quantity,
							restock: item.restock,
							revoke_purchase: item.revokePurchase,
							line_item: item.lineItem?.id,
						})),
				},
				{ throwOnError: true }
			);

			if (refund?.status === 'failed') {
				throw {
					message: __(
						'We were unable to issue a refund with this payment processor. Please check with your payment processor and try issuing the refund directly through the processor.',
						'surecart'
					),
				};
			}

			// invalidate page.
			await invalidateResolutionForStore();

			onRefunded(refund);
		} catch (e) {
			setError(e);
		} finally {
			setLoading(false);
		}
	};

	const updateItems = (itemsIndex, data) => {
		setItems(
			items.map((item, index) => {
				if (index !== itemsIndex) {
					// This isn't the item we care about - keep it as-is
					return item;
				}

				// Otherwise, this is the one we want - return an updated value
				return {
					...item,
					...data,
				};
			})
		);
	};

	return (
		<ScForm
			css={css`
				--sc-form-row-spacing: var(--sc-spacing-large);
			`}
			onScSubmit={(e) => {
				e.stopImmediatePropagation();
				onSubmit();
			}}
			onScSubmitForm={(e) => e.stopImmediatePropagation()}
		>
			<ScDrawer
				label={__('Refund Payment', 'surecart')}
				style={{ '--sc-drawer-size': '900px' }}
				open={true}
				onScAfterHide={onRequestClose}
				stickyHeader={true}
			>
				<div
					css={css`
						display: flex;
						flex-direction: column;
						height: 105%;
						padding: var(--sc-spacing-x-large);
						background: #cccccc2e;
					`}
				>
					{/* <ScAlert type="info" open>
						{__(
							"Refunds can take 5-10 days to appear on a customer's statement. Processor fees are typically not returned.",
							'surecart'
						)}
					</ScAlert> */}

					{/* If some items already refunded, we'll show and alert */}
					{totalRefundedQuantity > 0 && (
						<ScAlert type="info" open>
							{refundedMessage}
						</ScAlert>
					)}

					<div
						css={css`
							display: flex;
							justify-content: space-between;
							gap: var(--sc-spacing-large);
							@media (max-width: 768px) {
								flex-direction: column;
								gap: var(--sc-spacing-medium);
							}
						`}
					>
						<div
							css={css`
								flex-basis: 60%;
								@media (max-width: 768px) {
									flex-basis: 100%;
								}
							`}
						>
							{!!items?.length && (
								<Box
									css={css`
										display: grid;
										gap: 0.5em;
										overflow-x: auto;
										margin-bottom: var(--sc-spacing-small);
									`}
									title={__('Refund item(s)', 'surecart')}
								>
									<div>
										{items.map((purchase, index) => {
											const {
												product,
												quantity,
												originalQuantity,
												subscription,
												restock,
												revokePurchase,
												lineItem,
											} = purchase;
											return (
												<div
													css={css`
														border-bottom: ${index !==
														items.length - 1
															? '1px solid var(--sc-color-gray-300)'
															: 'none'};
														padding: var(
																--sc-spacing-medium
															)
															0;
														display: grid;
														gap: 0.5em;
													`}
												>
													<ScLineItem
														css={css`
															display: flex;
															gap: 1em;
															width: 100%;
														`}
													>
														{!!product?.image_url ? (
															<img
																css={css`
																	flex: 0 0
																		48px;
																	width: 48px;
																	height: 48px;
																`}
																src={
																	product?.image_url
																}
																slot="image"
															/>
														) : (
															<div
																css={css`
																	width: 48px;
																	height: 48px;
																	object-fit: cover;
																	background: var(
																		--sc-color-gray-100
																	);
																	display: flex;
																	align-items: center;
																	justify-content: center;
																	border-radius: var(
																		--sc-border-radius-small
																	);
																`}
																slot="image"
															>
																<ScIcon
																	style={{
																		width: '18px',
																		height: '18px',
																	}}
																	name={
																		'image'
																	}
																/>
															</div>
														)}
														<div
															slot="title"
															style={{
																width: 195,
															}}
														>
															{product?.name}
														</div>
														<div slot="description">
															{!!subscription && (
																<ScText>
																	{__(
																		'The associated subscription will also be cancelled.',
																		'surecart'
																	)}
																</ScText>
															)}
														</div>

														<div
															slot="price"
															css={css`
																display: flex;
																gap: 2em;
																justify-content: space-between;
																align-items: center;
																text-align: right;
																align-self: right;
															`}
														>
															<ScInput
																label={__(
																	'Quantity',
																	'surecart'
																)}
																showLabel={
																	false
																}
																value={quantity}
																max={
																	originalQuantity
																}
																type="number"
																min={0}
																onScInput={(
																	e
																) => {
																	updateItems(
																		index,
																		{
																			quantity:
																				parseInt(
																					e
																						.target
																						.value
																				),
																		}
																	);
																}}
															>
																<span
																	slot="suffix"
																	css={css`
																		opacity: 0.65;
																	`}
																>
																	{sprintf(
																		__(
																			'of %d',
																			'surecart'
																		),
																		originalQuantity
																	)}
																</span>
															</ScInput>
															<ScFormatNumber
																type="currency"
																value={
																	(lineItem
																		?.price
																		?.amount ??
																		0) *
																	(quantity ??
																		lineItem?.quantity)
																}
																currency={
																	lineItem
																		?.price
																		?.currency
																}
															/>
														</div>
													</ScLineItem>
													<div
														css={css`
															display: flex;
															gap: 1em;
														`}
													>
														<ScCheckbox
															css={css`
																padding-top: var(
																	--sc-spacing-large
																);
																padding-bottom: var(
																	--sc-spacing-small
																);
															`}
															checked={restock}
															onScChange={(e) => {
																updateItems(
																	index,
																	{
																		restock:
																			e
																				.target
																				.checked,
																	}
																);
															}}
														>
															{__(
																'Restock',
																'surecart'
															)}
														</ScCheckbox>

														{!getRefundedItem(
															lineItem
														)?.revoke_purchase && (
															<ScCheckbox
																css={css`
																	padding-top: var(
																		--sc-spacing-large
																	);
																	padding-bottom: var(
																		--sc-spacing-small
																	);
																`}
																checked={
																	revokePurchase
																}
																onScChange={(
																	e
																) => {
																	updateItems(
																		index,
																		{
																			revokePurchase:
																				e
																					.target
																					.checked,
																		}
																	);
																}}
															>
																{__(
																	'Revoke Purchase',
																	'surecart'
																)}
															</ScCheckbox>
														)}
													</div>
												</div>
											);
										})}
									</div>
								</Box>
							)}

							<Box
								title={__('Reason for refund', 'surecart')}
								css={css`
									margin-bottom: var(--sc-spacing-large);
								`}
							>
								<ScSelect
									name="reason"
									required
									value={reason}
									placeholder={__(
										'Select a reason',
										'surecart'
									)}
									onScChange={(e) => {
										setReason(e.target.value);
									}}
									choices={refundResasonOptions}
								/>
							</Box>
						</div>

						<div
							css={css`
								flex-basis: 40%;
								@media (max-width: 768px) {
									flex-basis: 100%;
								}
							`}
						>
							<Box
								title={__('Summary', 'surecart')}
								style={{
									marginBottom: 'var(--sc-spacing-large)',
								}}
							>
								{!totalQuantity ? (
									<ScText
										style={{
											'line-height':
												'var(--sc-line-height-dense)',
											'--color':
												'var(--sc-color-gray-500)',
										}}
									>
										{__('No items selected.', 'surecart')}
									</ScText>
								) : (
									<div>
										<ScLineItem>
											<span slot="description">
												{__(
													'Items subtotal',
													'surecart'
												)}{' '}
												({totalQuantity})
											</span>
											<span slot="price">
												<ScFormatNumber
													type="currency"
													value={items.reduce(
														(total, item) => {
															return (
																total +
																item.quantity *
																	item
																		.lineItem
																		?.price
																		?.amount
															);
														},
														0
													)}
													currency={charge?.currency}
												/>
											</span>
										</ScLineItem>
									</div>
								)}
							</Box>

							<Box
								css={css`
									margin-top: var(--sc-spacing-large);
								`}
								title={__('Refund Amount', 'surecart')}
							>
								<ScPriceInput
									required
									name="amount"
									label={__('Manual', 'surecart')}
									currencyCode={charge?.currency}
									value={amount}
									max={
										charge?.amount - charge?.refunded_amount
									}
									onScChange={(e) => {
										setAmount(e.target.value);
									}}
									showCode
								/>

								<ScText
									css={css`
										margin-top: var(--sc-spacing-small);
										color: var(--sc-color-gray-500);
									`}
								>
									{__('Available for refund: ', 'surecart')}
									<ScFormatNumber
										type="currency"
										value={
											charge?.amount -
											charge?.refunded_amount
										}
										currency={charge?.currency}
									/>
								</ScText>
							</Box>
						</div>
					</div>

					<Error error={error} setError={setError} />

					{(loading || fetchingRefunds || fetchingPurchases) && (
						<sc-block-ui
							spinner
							style={{ zIndex: 9 }}
						></sc-block-ui>
					)}
				</div>
				<ScButton
					type="primary"
					slot="footer"
					busy={loading}
					submit
					disabled={loading || !amount}
				>
					{__('Refund', 'surecart')}
				</ScButton>
				<ScButton type="text" slot="footer" onClick={onRequestClose}>
					{__('Cancel', 'surecart')}
				</ScButton>
			</ScDrawer>
		</ScForm>
	);
};
