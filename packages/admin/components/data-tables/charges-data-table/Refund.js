/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { Modal, Button } from '@wordpress/components';
import {
	CeChoices,
	CeForm,
	CeFormControl,
	CePriceInput,
	CeSelect,
} from '@checkout-engine/components-react';
import { css, jsx } from '@emotion/core';
import apiFetch from '@wordpress/api-fetch';
import { useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { dispatch, select, useSelect } from '@wordpress/data';
import { store } from '../../../store/data';
import useCurrentPage from '../../../mixins/useCurrentPage';
import { castArray } from 'lodash';

export default ({ charge, onRequestClose }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { id } = useCurrentPage('order');

	const { subscriptions, purchases } = useSelect(
		(select) => {
			const purchases = select(store).selectCollection('purchase');
			return {
				subscriptions: (
					select(store).selectCollection('subscription') || []
				).filter(
					(subscription) =>
						charge.invoice === subscription.latest_invoice &&
						subscription?.status !== 'canceled'
				),
				purchases:
					purchases.filter(
						(purchase) =>
							purchase?.order &&
							purchase.order === charge?.order &&
							!purchase?.subscription &&
							!purchase?.revoked
					) ||
					purchases.filter(
						(purchase) =>
							purchase?.invoice &&
							purchase.invoice === charge?.invoice &&
							!purchase?.subscription &&
							!purchase?.revoked
					),
			};
		},
		[charge]
	);

	/**
	 * Handle submit.
	 */
	const onSubmit = async (e) => {
		setError(false);
		setLoading(true);

		// get form json.
		const { amount, reason, revoked_purchases, subscriptions } =
			await e.target.getFormJson();

		// refund charge and maybe cancel subscription.
		try {
			await Promise.all([
				refundCharge({
					charge,
					amount,
					reason,
					revoked_purchases: castArray(revoked_purchases),
				}),
				Promise.all(
					castArray(subscriptions).map((id) => cancelSubscription(id))
				),
			]);
			onRequestClose();
		} catch (e) {
			console.error(e);
			if (e?.additional_errors?.[0]?.message) {
				setError(e?.additional_errors?.[0]?.message);
			} else {
				setError(
					e?.message ||
						__('Failed to create refund.', 'checkout_engine')
				);
			}
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Refund a charge.
	 */
	const refundCharge = async ({
		charge,
		amount,
		reason,
		revoked_purchases,
	}) => {
		const result = await apiFetch({
			path: addQueryArgs(`checkout-engine/v1/refunds/`, {
				expand: [
					'charge',
					'charge.payment_method',
					'charge.payment_method.card',
				],
			}),
			method: 'POST',
			data: {
				amount,
				reason,
				charge: charge?.id,
				revoked_purchases: Array.isArray(revoked_purchases)
					? revoked_purchases
					: [revoked_purchases],
			},
		});
		if (result.id) {
			dispatch(store).receiveModels(result);
		} else {
			throw __('Could not create refund.', 'checkout_engine');
		}

		// refetch purchases.
		const purchases = await apiFetch({
			path: addQueryArgs(`checkout-engine/v1/purchases/`, {
				order_ids: [id],
				context: 'edit',
				expand: ['product', 'product.price'],
			}),
		});
		dispatch(store).receiveModels(purchases);
	};

	/**
	 * Cancel a subscription.
	 */
	const cancelSubscription = async (id) => {
		if (!id) return;
		const result = await apiFetch({
			path: addQueryArgs(
				`checkout-engine/v1/subscriptions/${id}/cancel`,
				{
					cancel_behavior: 'immediate',
					expand: [
						'price',
						'price.product',
						'latest_invoice',
						'purchase',
						'purchase.product',
					],
				}
			),
			method: 'PATCH',
		});
		if (result.id) {
			dispatch(store).receiveModels(result);
		} else {
			throw __('Could not cancel subscription.', 'checkout_engine');
		}
	};

	return (
		<Modal
			title={__('Refund Payment', 'checkout_engine')}
			css={css`
				max-width: 500px !important;
			`}
			onRequestClose={onRequestClose}
			shouldCloseOnClickOutside={false}
		>
			<CeForm
				onCeFormSubmit={onSubmit}
				css={css`
					--ce-form-row-spacing: var(--ce-spacing-large);
				`}
			>
				<ce-alert type="info" open>
					{__(
						"Refunds can take 5-10 days to appear on a customer's statement. Processor fees are typically not returned.",
						'checkout_engine'
					)}
				</ce-alert>
				<div>
					<CePriceInput
						required
						name="amount"
						label={__('Refund', 'checkout_engine')}
						currencyCode={charge?.currency}
						value={charge?.amount - charge?.refunded_amount}
						max={charge?.amount - charge?.refunded_amount}
						showCode
					/>
				</div>
				<div>
					<CeFormControl label={__('Reason', 'checkout_engine')}>
						<CeSelect
							name="reason"
							value={'requested_by_customer'}
							placeholder={__(
								'Select a reason',
								'checkout_engine'
							)}
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
					</CeFormControl>
				</div>

				{!!subscriptions?.length && (
					<CeChoices
						label={__('Cancel Subscription', 'checkout_engine')}
						help={__(
							'Immediately cancel a subscription and revoke the associated purchase.',
							'checkout_engine'
						)}
					>
						{subscriptions.map((subscription) => {
							const product = select(store).selectRelation(
								'subscription',
								subscription?.id,
								'price.product'
							);
							return (
								<ce-choice
									value={[subscription.id]}
									name="subscriptions"
									type="checkbox"
									checked={true}
								>
									<ce-line-item>
										{!!product?.image_url && (
											<img
												src={product?.image_url}
												slot="image"
											/>
										)}
										<span slot="title">
											{product?.name}
										</span>
										<span slot="description">
											Qty: {subscription?.quantity}
										</span>
									</ce-line-item>
								</ce-choice>
							);
						})}
					</CeChoices>
				)}

				{!!purchases && !!purchases?.length && (
					<CeChoices
						label={__('Revoke Purchases', 'checkout_engine')}
						help={__(
							'Revoking a purchase updates purchase records for the customer which may remove access to products.',
							'checkout_engine'
						)}
					>
						<div>
							{(purchases || []).map((purchase) => {
								const { quantity, id, subscription } = purchase;
								const product = select(store).selectRelation(
									'purchase',
									id,
									'product'
								);
								if (subscription) return null;
								return (
									<ce-choice
										value={[id]}
										key={id}
										name="revoked_purchases"
										type="checkbox"
										checked={true}
									>
										<ce-line-item>
											{!!product?.image_url && (
												<img
													src={product?.image_url}
													slot="image"
												/>
											)}
											<span slot="title">
												{product?.name}
											</span>
											<span slot="description">
												Qty: {quantity}
											</span>
										</ce-line-item>
									</ce-choice>
								);
							})}
						</div>
					</CeChoices>
				)}

				<ce-alert type="danger" open={error}>
					{error}
				</ce-alert>

				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					<Button isPrimary isBusy={loading} type="submit">
						{__('Refund', 'checkout_engine')}
					</Button>
					<Button onClick={onRequestClose}>
						{__('Cancel', 'checkout_engine')}
					</Button>
				</div>

				{loading && (
					<ce-block-ui spinner style={{ zIndex: 9 }}></ce-block-ui>
				)}
			</CeForm>
		</Modal>
	);
};
