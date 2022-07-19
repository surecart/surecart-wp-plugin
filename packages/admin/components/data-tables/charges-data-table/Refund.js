import { css, jsx } from '@emotion/core';
import {
	ScAlert,
	ScButton,
	ScForm,
	ScFormControl,
	ScPriceInput,
	ScSelect,
} from '@surecart/components-react';
import { Button, Modal } from '@wordpress/components';
import { useState } from '@wordpress/element';
/** @jsx jsx */
import { __ } from '@wordpress/i18n';

import useEntity from '../../../mixins/useEntity';

export default ({ charge, onRequestClose }) => {
	const [loading, setLoading] = useState(false);
	const [amount, setAmount] = useState(charge.amount);
	const [reason, setReason] = useState('requested_by_customer');
	const [error, setError] = useState(null);
	const { saveRefund } = useEntity('refund');

	/**
	 * Handle submit.
	 */
	const onSubmit = async (e) => {
		setError(false);
		setLoading(true);

		try {
			const refund = await saveRefund({
				query: {
					expand: [
						'charge',
						'charge.payment_method',
						'charge.payment_method.card',
						'charge.payment_intent',
					],
				},
				data: {
					amount,
					reason,
					charge: charge?.id,
				},
			});
			if (refund?.status === 'failed') {
				throw {
					message: __(
						'Could not refund the charge. Please check with the processor for more details.',
						'surecart'
					),
				};
			}
			onRequestClose();
		} catch (e) {
			console.error(e);
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
						value={charge?.amount - charge?.refunded_amount}
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

				<ScAlert type="danger" open={error}>
					{error}
				</ScAlert>

				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					<ScButton type="primary" busy={loading} submit>
						{__('Refund', 'surecart')}
					</ScButton>
					<ScButton type="text" onClick={onRequestClose}>
						{__('Cancel', 'surecart')}
					</ScButton>
				</div>

				{loading && (
					<sc-block-ui spinner style={{ zIndex: 9 }}></sc-block-ui>
				)}
			</ScForm>
		</Modal>
	);
};
