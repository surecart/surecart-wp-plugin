/** @jsx jsx   */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { select, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useEffect } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';
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
	ScDrawer,
	ScInput,
	ScCheckbox,
	ScFormatNumber,
	ScText,
	ScBlockUi,
} from '@surecart/components-react';
import Error from '../../../components/Error';
import Box from '../../../ui/Box';
import useRefund from '../../hooks/useRefund';
import ProductLineItem from '../../../ui/ProductLineItem';
import { refundResasonOptions } from '../../../util/refunds';

export default ({ checkout, charge, onRequestClose, onRefunded }) => {
	if (!checkout.line_items) {
		return null;
	}

	const lineItems = checkout?.line_items?.data || [];
	const [loading, setLoading] = useState(false);
	const [amount, setAmount] = useState(
		charge?.amount - charge?.refunded_amount
	);
	const [updateReferralCommission, setUpdateReferralCommission] =
		useState(true);
	const [totalQuantity, setTotalQuantity] = useState(0);
	const [reason, setReason] = useState('requested_by_customer');
	const [error, setError] = useState(null);
	const [items, setItems] = useState([]);
	const { refunds, loading: fetchingRefunds } = useRefund(charge?.id);

	const { invalidateResolutionForStore } = useDispatch(coreStore);
	const getRefundedItem = (lineItem) => {
		for (const refund of refunds || []) {
			const refundItem = refund?.refund_items?.data?.find(
				(item) => item?.line_item?.id === lineItem?.id
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

	const getTotalRefundedQuantityByLineItem = (lineItem) => {
		return (refunds ?? []).reduce((totalQuantity, refund) => {
			const refundItem = refund?.refund_items?.data?.find(
				(item) => item?.line_item?.id === lineItem?.id
			);
			return totalQuantity + (refundItem?.quantity || 0);
		}, 0);
	};

	const totalLineItemQuantity = (lineItems ?? []).reduce(
		(totalQuantity, lineItem) => {
			return totalQuantity + (lineItem?.quantity || 0);
		},
		0
	);

	const refundedMessage =
		totalRefundedQuantity !== totalLineItemQuantity
			? __(
					'Some items in this order have been removed or added to a return.',
					'surecart'
			  )
			: __('All items in this order have been refunded.', 'surecart');

	useEffect(() => {
		setItems(
			(lineItems || [])
				.filter((lineItem) => {
					const qtyRefunded =
						getTotalRefundedQuantityByLineItem(lineItem);
					return lineItem?.quantity - qtyRefunded > 0;
				})
				.map((lineItem) => {
					const qtyRefunded =
						getTotalRefundedQuantityByLineItem(lineItem);
					const refundedItem = getRefundedItem(lineItem);

					return {
						...lineItem,
						quantity: 0,
						originalQuantity: lineItem?.quantity - qtyRefunded,
						revokePurchase: refundedItem?.revoke_purchase || true,
						restock: refundedItem?.restock || false,
					};
				})
		);
	}, [lineItems, refunds]);

	// On change individual amount, update the setAmount.
	useEffect(() => {
		const totalAmount = items.reduce((total, item) => {
			return total + item.quantity * item?.price?.amount;
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

		const { baseURL } = select(coreStore).getEntityConfig(
			'surecart',
			'refund'
		);

		try {
			const refund = await apiFetch({
				method: 'POST',
				path: addQueryArgs(baseURL, {
					...(checkout?.referral && {
						update_referral_commission: updateReferralCommission,
					}),
				}),
				data: {
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
							line_item: item.id,
						})),
				},
			}).catch((e) => {
				throw e;
			});

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
										{items.map((lineItem, index) => {
											const {
												quantity,
												originalQuantity,
												revokePurchase,
												restock,
											} = lineItem;

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
													<ProductLineItem
														lineItem={lineItem}
														suffix={
															<div
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
																	value={
																		quantity
																	}
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
														}
													>
														{/* {!!subscription && (
															<ScText>
																{__(
																	'The associated subscription will also be cancelled.',
																	'surecart'
																)}
															</ScText>
														)} */}
													</ProductLineItem>

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

								{!!checkout?.referral && (
									<div>
										<ScCheckbox
											css={css`
												padding-top: var(
													--sc-spacing-large
												);
												padding-bottom: var(
													--sc-spacing-small
												);
											`}
											checked={updateReferralCommission}
											onScChange={(e) =>
												setUpdateReferralCommission(
													e.target.checked
												)
											}
										>
											{__(
												'Adjust referral commission',
												'surecart'
											)}
										</ScCheckbox>

										<ScText
											css={css`
												color: var(--sc-color-gray-500);
											`}
										>
											{__(
												'Enable this to automatically adjust the referral commission in proportion to the refund amount.',
												'surecart'
											)}
										</ScText>
									</div>
								)}
							</Box>
						</div>
					</div>

					<Error error={error} setError={setError} />

					{(loading || fetchingRefunds) && (
						<ScBlockUi spinner style={{ zIndex: 9 }} />
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
