/** @jsx jsx   */
import { css, jsx } from '@emotion/core';
import {
	ScAlert,
	ScButton,
	ScCheckbox,
	ScFlex,
	ScForm,
	ScFormControl,
	ScPriceInput,
	ScProductLineItem,
	ScSelect,
} from '@surecart/components-react';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { Modal } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { intervalString } from '../../../util/translations';

export default ({ charge, onRequestClose, onRefunded, checkout }) => {
	const [loading, setLoading] = useState(false);
	const [amount, setAmount] = useState(
		charge?.amount - charge?.refunded_amount
	);
	const [reason, setReason] = useState('requested_by_customer');
	const [error, setError] = useState(null);
	const [revokedPurchaseIds, setRevokedPurchaseIds] = useState([]);

	const { saveEntityRecord, invalidateResolutionForStore } =
		useDispatch(coreStore);

	const line_items = checkout?.line_items?.data;

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
	const onClickProductItem = (id, checked) => {
		setRevokedPurchaseIds((state) =>
			checked ? state.filter((item) => id !== item) : [...state, id]
		);
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

				<div>
					<ScFormControl label={__('Revoke Purchase(s)', 'surecart')}>
						<div
							css={css`
								padding: 0.44rem 0;
							`}
						>
							{(line_items || []).map((item) => {
								const checked = revokedPurchaseIds.includes(
									item.id
								);
								return (
									<ScCheckbox
										key={item.id}
										checked={checked}
										onScChange={() =>
											onClickProductItem(item.id, checked)
										}
									>
										<ScProductLineItem
											css={css`
												width: 100%;
											`}
											imageUrl={
												item?.price?.product?.image_url
											}
											name={item?.price?.product?.name}
											editable={false}
											removable={false}
											quantity={item.quantity}
											amount={item.subtotal_amount}
											currency={item?.price?.currency}
											trialDurationDays={
												item?.price?.trial_duration_days
											}
											interval={intervalString(
												item?.price
											)}
										/>
									</ScCheckbox>
								);
							})}
						</div>
					</ScFormControl>
				</div>

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
