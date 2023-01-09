/** @jsx jsx   */
import { css, jsx } from '@emotion/core';
import {
	ScAlert,
	ScButton,
	ScChoices,
	ScChoice,
	ScFlex,
	ScForm,
	ScFormControl,
	ScLineItem,
	ScPriceInput,
	ScSelect,
	ScIcon,
} from '@surecart/components-react';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { Modal } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default ({ charge, onRequestClose, onRefunded, purchases }) => {
	const [loading, setLoading] = useState(false);
	const [amount, setAmount] = useState(
		charge?.amount - charge?.refunded_amount
	);
	const [reason, setReason] = useState('requested_by_customer');
	const [error, setError] = useState(null);
	const [revokedPurchaseIds, setRevokedPurchaseIds] = useState([]);
	const [selectedAllPurchases, setSelectedAllPurchases] = useState(false);

	const { saveEntityRecord, invalidateResolutionForStore } =
		useDispatch(coreStore);

	const revokablePurchases = (purchases || []).filter(
		(purchase) => !purchase?.revoked
	);

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
					revoked_purchases: revokedPurchaseIds,
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
			if (e?.additional_errors?.[0]?.message) {
				setError(e?.additional_errors?.[0]?.message);
			} else {
				setError(
					e?.message || __('Failed to create refund.', 'surecart')
				);
			}
		} finally {
			setLoading(false);
		}
	};

	// handle purchased item click for revoke
	const onTogglePurchase = (id, checked) => {
		setRevokedPurchaseIds((state) =>
			checked ? state.filter((item) => id !== item) : [...state, id]
		);
		if (selectedAllPurchases) setSelectedAllPurchases(false);
	};

	// toggle select all purchases for revoke
	const onToggleAllPurchaseSelect = (checked) => {
		setRevokedPurchaseIds(() =>
			!checked ? revokablePurchases?.map((purchase) => purchase.id) : []
		);
		setSelectedAllPurchases(!checked);
	};

	return (
		<Modal
			title={__('Refund Payment', 'surecart')}
			css={css`
				max-width: 500px !important;
			`}
			onRequestClose={onRequestClose}
			shouldCloseOnClickOutside={false}
		>
			<ScForm
				onScFormSubmit={onSubmit}
				css={css`
					--sc-form-row-spacing: var(--sc-spacing-large);
				`}
			>
				<ScAlert type="info" open>
					{__(
						"Refunds can take 5-10 days to appear on a customer's statement. Processor fees are typically not returned.",
						'surecart'
					)}
				</ScAlert>
				<div>
					<ScPriceInput
						required
						name="amount"
						label={__('Refund', 'surecart')}
						currencyCode={charge?.currency}
						value={amount}
						max={charge?.amount - charge?.refunded_amount}
						onScChange={(e) => {
							setAmount(e.target.value);
						}}
						showCode
					/>
				</div>
				<div>
					<ScFormControl label={__('Reason', 'surecart')}>
						<ScSelect
							name="reason"
							value={reason}
							placeholder={__('Select a reason', 'surecart')}
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
				{!!revokablePurchases?.length && (
					<ScFormControl label={__('Revoke Purchase(s)', 'surecart')}>
						<ScButton
							type="link"
							size="small"
							slot="label-end"
							onClick={() =>
								onToggleAllPurchaseSelect(selectedAllPurchases)
							}
						>
							{selectedAllPurchases
								? __('Unselect All', 'surecart')
								: __('Select All', 'surecart')}
						</ScButton>
						<ScChoices>
							{revokablePurchases.map((purchase) => {
								const { id, product, quantity, subscription } =
									purchase;
								const checked = revokedPurchaseIds.includes(id);
								return (
									<ScChoice
										key={id}
										type="checkbox"
										checked={checked}
										onScChange={() =>
											onTogglePurchase(id, checked)
										}
									>
										<ScLineItem>
											{!!product?.image_url ? (
												<img
													src={product?.image_url}
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
												<span>
													{__('Qty', 'surecart')}:{' '}
													{quantity}
												</span>
												{!!subscription && (
													<sc-tag type="info">
														{__(
															'The associated subscription will also be cancelled.',
															'surecart'
														)}
													</sc-tag>
												)}
											</div>
										</ScLineItem>
									</ScChoice>
								);
							})}
						</ScChoices>
					</ScFormControl>
				)}

				<ScAlert type="danger" open={error}>
					{error}
				</ScAlert>

				<ScFlex alignItems="center">
					<ScButton type="primary" busy={loading} submit>
						{__('Refund', 'surecart')}
					</ScButton>
					<ScButton type="text" onClick={onRequestClose}>
						{__('Cancel', 'surecart')}
					</ScButton>
				</ScFlex>

				{loading && (
					<sc-block-ui spinner style={{ zIndex: 9 }}></sc-block-ui>
				)}
			</ScForm>
		</Modal>
	);
};
