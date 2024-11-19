/** @jsx jsx   */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useDispatch } from '@wordpress/data';
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
	ScFormControl,
	ScLineItem,
	ScPriceInput,
	ScSelect,
	ScIcon,
	ScDrawer,
	ScInput,
	ScCheckbox,
} from '@surecart/components-react';

export default ({ charge, onRequestClose, onRefunded, purchases }) => {
	const [loading, setLoading] = useState(false);
	const [amount, setAmount] = useState(
		charge?.amount - charge?.refunded_amount
	);
	const [reason, setReason] = useState('requested_by_customer');
	const [error, setError] = useState(null);

	const { saveEntityRecord, invalidateResolutionForStore } =
		useDispatch(coreStore);

	const [items, setItems] = useState([]);

	useEffect(() => {
		setItems(
			(purchases || [])
				.filter((purchase) => !purchase?.revoked)
				.filter(({ id, quantity }) => {
					// const qtyRefunded = 0; // getQtyRefunded(id);
					// return quantity - qtyRefunded > 0;
					return true;
				})
				.map(({ id, quantity, ...item }) => {
					const qtyRefunded = 0; // getQtyRefunded(id);
					return {
						...item,
						id,
						quantity: quantity - qtyRefunded,
						originalQuantity: quantity - qtyRefunded,
						revokePurchase: true,
						restock: false,
						lineItem: item.line_items?.data?.[0],
					};
				})
		);

		// TODO: Need to change the amount based on the items selected.
		// const totalAmount = items.reduce((total, item) => {
		// 	return total + item.quantity * item.price;
		// }, charge?.amount - charge?.refunded_amount);
		// setAmount(totalAmount);
	}, [purchases]);

	console.log('purchases', purchases);

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
					refund_items: items.map((item) => ({
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
				style={{ '--sc-drawer-size': '600px' }}
				open={true}
				onScAfterHide={onRequestClose}
				stickyHeader={true}
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
							padding: var(--sc-spacing-x-large);
							display: grid;
							gap: 0.5em;
						`}
					>
						<ScAlert type="info" open>
							{__(
								"Refunds can take 5-10 days to appear on a customer's statement. Processor fees are typically not returned.",
								'surecart'
							)}
						</ScAlert>

						{!!items?.length && (
							<ScFormControl
								label={__('Refund item(s)', 'surecart')}
								css={css`
									margin-top: var(--sc-spacing-small);
								`}
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
													border-bottom: 1px solid
														var(--sc-color-gray-300);
													padding: var(
															--sc-spacing-medium
														)
														0;
													display: grid;
													gap: 0.5em;
												`}
											>
												<ScLineItem css={css``}>
													{!!product?.image_url ? (
														<img
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
																name={'image'}
															/>
														</div>
													)}
													<span slot="title">
														{product?.name}
													</span>
													<div slot="description">
														{!!subscription && (
															<sc-tag type="info">
																{__(
																	'The associated subscription will also be cancelled.',
																	'surecart'
																)}
															</sc-tag>
														)}
													</div>
													<div slot="price">
														<div
															css={css`
																display: flex;
																gap: 1em;
																justify-content: space-between;
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

															<div>
																{lineItem?.price && (
																	<ScPriceInput
																		label={__(
																			'Price',
																			'surecart'
																		)}
																		value={
																			lineItem?.price
																		}
																		currencyCode={
																			charge?.currency
																		}
																		showCode
																		disabled
																	/>
																)}
															</div>
														</div>
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
															updateItems(index, {
																restock:
																	e.target
																		.checked,
															});
														}}
													>
														{__(
															'Restock',
															'surecart'
														)}
													</ScCheckbox>

													<ScCheckbox
														css={css`
															padding-top: var(
																--sc-spacing-large
															);
															padding-bottom: var(
																--sc-spacing-small
															);
														`}
														checked={revokePurchase}
														onScChange={(e) => {
															updateItems(index, {
																revokePurchase:
																	e.target
																		.checked,
															});
														}}
													>
														{__(
															'Revoke Purchase',
															'surecart'
														)}
													</ScCheckbox>
												</div>
											</div>
										);
									})}
								</div>
							</ScFormControl>
						)}

						<div>
							<ScFormControl label={__('Reason', 'surecart')}>
								<ScSelect
									name="reason"
									value={reason}
									placeholder={__(
										'Select a reason',
										'surecart'
									)}
									onScChange={(e) => {
										setReason(e.target.value);
									}}
									choices={[
										{
											label: __('Duplicate'),
											value: 'duplicate',
										},
										{
											label: __('Fraudulent'),
											value: 'fraudulent',
										},
										{
											label: __('Requested By Customer'),
											value: 'requested_by_customer',
										},
									]}
								/>
							</ScFormControl>
						</div>

						<div>
							<ScPriceInput
								required
								name="amount"
								label={__('Refund Amount', 'surecart')}
								currencyCode={charge?.currency}
								value={amount}
								max={charge?.amount - charge?.refunded_amount}
								onScChange={(e) => {
									setAmount(e.target.value);
								}}
								showCode
							/>
						</div>

						<ScAlert type="danger" open={error}>
							{error}
						</ScAlert>

						{loading && (
							<sc-block-ui
								spinner
								style={{ zIndex: 9 }}
							></sc-block-ui>
						)}
					</div>
				</div>
				<ScButton type="primary" slot="footer" busy={loading} submit>
					{__('Refund', 'surecart')}
				</ScButton>
				<ScButton type="text" slot="footer" onClick={onRequestClose}>
					{__('Cancel', 'surecart')}
				</ScButton>
			</ScDrawer>
		</ScForm>
	);
};
