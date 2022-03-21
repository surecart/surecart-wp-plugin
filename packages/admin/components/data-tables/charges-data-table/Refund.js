/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { Modal, Button } from '@wordpress/components';
import {
	CeAlert,
	CeForm,
	CeFormControl,
	CePriceInput,
	CeSelect,
} from '@checkout-engine/components-react';
import { css, jsx } from '@emotion/core';
import { useState } from '@wordpress/element';
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
			await saveRefund({
				query: {
					expand: [
						'charge',
						'charge.payment_method',
						'charge.payment_method.card',
					],
				},
				data: {
					amount,
					reason,
					charge: charge?.id,
				},
			});
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
			<CeForm
				onCeFormSubmit={onSubmit}
				css={css`
					--ce-form-row-spacing: var(--ce-spacing-large);
				`}
			>
				<CeAlert type="info" open>
					{__(
						"Refunds can take 5-10 days to appear on a customer's statement. Processor fees are typically not returned.",
						'surecart'
					)}
				</CeAlert>
				<div>
					<CePriceInput
						required
						name="amount"
						label={__('Refund', 'surecart')}
						currencyCode={charge?.currency}
						value={charge?.amount - charge?.refunded_amount}
						max={charge?.amount - charge?.refunded_amount}
						onCeChange={(e) => {
							setAmount(e.target.value);
						}}
						showCode
					/>
				</div>
				<div>
					<CeFormControl label={__('Reason', 'surecart')}>
						<CeSelect
							name="reason"
							value={reason}
							placeholder={__('Select a reason', 'surecart')}
							onCeChange={(e) => {
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
					</CeFormControl>
				</div>

				<CeAlert type="danger" open={error}>
					{error}
				</CeAlert>

				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					<Button isPrimary isBusy={loading} type="submit">
						{__('Refund', 'surecart')}
					</Button>
					<Button onClick={onRequestClose}>
						{__('Cancel', 'surecart')}
					</Button>
				</div>

				{loading && (
					<ce-block-ui spinner style={{ zIndex: 9 }}></ce-block-ui>
				)}
			</CeForm>
		</Modal>
	);
};
