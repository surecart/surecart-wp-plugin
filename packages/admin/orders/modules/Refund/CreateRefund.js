/** @jsx jsx   */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { select, useDispatch } from '@wordpress/data';
import { store as coreStore, useEntityRecords } from '@wordpress/core-data';
import { useState, useEffect } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { ProgressBar } from '@wordpress/components';

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
	ScCheckbox,
	ScFormatNumber,
	ScText,
	ScBlockUi,
	ScIcon,
} from '@surecart/components-react';
import Error from '../../../components/Error';
import Box from '../../../ui/Box';
import { refundResasonOptions } from '../../../util/refunds';
import RefundItem from './RefundItem';

export default ({ checkout, charge, chargeIds, onRequestClose, onRefunded }) => {
	if (!checkout.line_items) {
		return null;
	}
	const lineItems = checkout?.line_items?.data || [];
	const [loading, setLoading] = useState(false);
	const [updateReferralCommission, setUpdateReferralCommission] =
		useState(true);
	const [reason, setReason] = useState('requested_by_customer');
	const [error, setError] = useState(null);
	const [refundItems, setRefundItems] = useState([]);
	const [amount, setAmount] = useState(0);
	const availableRefundAmount = charge?.amount - charge?.refunded_amount;
	const { records: refunds, hasResolved: hasResolvedRefunds } =
		useEntityRecords('surecart', 'refund', {
			context: 'edit',
			charge_ids: chargeIds,
			per_page: 100,
			expand: ['refund_items', 'refund_item.line_item'],
		});

	const { invalidateResolutionForStore } = useDispatch(coreStore);

	const totalRefundedQuantity = (refunds ?? []).reduce(
		(totalQuantity, refund) => {
			const refundItemsQuantity = (
				refund?.refund_items?.data ?? []
			).reduce((subtotalQuantity, item) => {
				return subtotalQuantity + (item?.quantity || 0);
			}, 0);
			return totalQuantity + refundItemsQuantity;
		},
		0
	);

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
		setRefundItems(
			(checkout?.line_items?.data || []).map((lineItem) => {
				return {
					...lineItem,
					refundQuantity: 0,
					revokePurchase: true,
					restock: true,
				};
			})
		);
	}, [checkout?.line_items?.data]);

	useEffect(() => {
		const totalAmount = refundItems.reduce((total, refundItem) => {
			return (
				total + refundItem.refundQuantity * refundItem?.price?.amount
			);
		}, 0);
		setAmount(
			totalAmount > availableRefundAmount
				? availableRefundAmount
				: totalAmount
		);
	}, [refundItems.map(item => item.refundQuantity).join(','), availableRefundAmount]);

	const totalQuantity = refundItems.reduce((total, refundItem) => {
		return total + refundItem.refundQuantity;
	}, 0);

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
					refund_items: refundItems
						.filter((refundItem) => refundItem.refundQuantity > 0)
						.map((refundItem) => ({
							purchase: refundItem.id,
							quantity: refundItem.refundQuantity,
							restock: refundItem.restock,
							revoke_purchase: refundItem.revokePurchase,
							line_item: refundItem.id,
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

	/**
	 * Update the refund item.
	 */
	const updateItem = (data, lineItem) => {
		setRefundItems(
			refundItems.map((item) =>
				item?.id === lineItem?.id ? { ...item, ...data } : item
			)
		);
	};

	const renderContent = () => (
		<div
			css={css`
				display: flex;
				flex-direction: column;
				height: 105%;
				padding: var(--sc-spacing-x-large);
				background: #cccccc2e;
			`}
		>
			<Error error={error} setError={setError} />

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
					{!!refundItems?.length &&
						totalRefundedQuantity < totalLineItemQuantity && (
							<Box
								css={css`
									display: grid;
									gap: 0.5em;
									overflow-x: auto;
									margin-bottom: var(--sc-spacing-small);
								`}
								title={__('Refund item(s)', 'surecart')}
							>
								{refundItems.map((refundItem) => (
									<RefundItem
										key={refundItem.id}
										refundItem={refundItem}
										chargeIds={chargeIds}
										onUpdate={(values) => {
											updateItem(values, refundItem);
										}}
									/>
								))}
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
							placeholder={__('Select a reason', 'surecart')}
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
						display: flex;
						flex-direction: column;
						gap: var(--sc-spacing-large);
						@media (max-width: 768px) {
							flex-basis: 100%;
						}
					`}
				>
					<Box title={__('Summary', 'surecart')}>
						{!totalQuantity ? (
							<ScLineItem>
								<span slot="description">
									{__('No items selected.', 'surecart')}
								</span>
							</ScLineItem>
						) : (
							<div>
								<ScLineItem>
									<span slot="description">
										{__('Items subtotal', 'surecart')} (
										{totalQuantity})
									</span>
									<span slot="price">
										<ScFormatNumber
											type="currency"
											value={refundItems.reduce(
												(total, refundItem) => {
													const lineItem =
														refundItems.find(
															(item) =>
																item.id ===
																refundItem.id
														);
													return (
														total +
														refundItem.refundQuantity *
															lineItem?.price
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
						title={__('Refund Amount', 'surecart')}
						footer={
							<span
								css={css`
									font-size: 12px;
									opacity: 0.65;
									display: flex;
									align-items: flex-start;
									gap: var(--sc-spacing-small);
								`}
							>
								<ScIcon
									name="info"
									css={css`
										flex: 1 0 12px;
										height: 16px;
									`}
								/>
								{__(
									"Refunds can take 5-10 days to appear on a customer's statement. Processing fees are typically not returned.",
									'surecart'
								)}
							</span>
						}
					>
						<ScPriceInput
							required
							name="amount"
							label={__('Manual', 'surecart')}
							currencyCode={charge?.currency}
							value={amount}
							max={availableRefundAmount}
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
								value={availableRefundAmount}
								currency={charge?.currency}
							/>
						</ScText>

						{!!checkout?.referral && (
							<div>
								<ScCheckbox
									css={css`
										padding-top: var(--sc-spacing-large);
										padding-bottom: var(--sc-spacing-small);
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

			{loading && <ScBlockUi spinner style={{ zIndex: 9 }} />}
		</div>
	);

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
				{!hasResolvedRefunds ? (
					<div
						css={css`
							display: flex;
							justify-content: center;
							align-items: center;
							height: 100%;
						`}
					>
						<ProgressBar />
					</div>
				) : (
					renderContent()
				)}

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
