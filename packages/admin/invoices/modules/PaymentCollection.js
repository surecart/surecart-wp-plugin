/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import PaymentMethods from './PaymentMethods';
import Box from '../../ui/Box';
import {
	ScButton,
	ScFormControl,
	ScIcon,
	ScRadio,
	ScRadioGroup,
	ScText,
} from '@surecart/components-react';
import DatePicker from '../../components/DatePicker';

export default ({
	invoice,
	updateInvoice,
	checkout,
	loading,
	setBusy,
	paymentMethod,
	setPaymentMethod,
}) => {
	const [modal, setModal] = useState(false);
	const isDraftInvoice = invoice?.status === 'draft';

	return (
		<Box
			loading={loading}
			css={css`
				margin-top: var(--sc-spacing-medium);
			`}
			title={__('Payment Collection', 'surecart')}
		>
			<ScRadioGroup
				onScChange={(e) =>
					updateInvoice({
						automatic_collection: !invoice?.automatic_collection,
					})
				}
			>
				<ScRadio value="false" checked={!invoice?.automatic_collection}>
					<ScText
						tag="h3"
						style={{
							'--font-weight': 'var(--sc-font-weight-bold)',
							'--font-size': 'var(--sc-font-size-medium)',
						}}
					>
						{__('Request Payment', 'surecart')}
					</ScText>

					<div
						css={css`
							margin-top: var(--sc-spacing-small);
							margin-bottom: var(--sc-spacing-medium);
						`}
					>
						<ScText>
							{__(
								'Create an invoice requesting payment on a specific date',
								'surecart'
							)}
						</ScText>
					</div>
				</ScRadio>

				<ScRadio value="true" checked={invoice?.automatic_collection}>
					<ScText
						tag="h3"
						style={{
							'--font-weight': 'var(--sc-font-weight-bold)',
							'--font-size': 'var(--sc-font-size-medium)',
						}}
					>
						{__('Autocharge Customer', 'surecart')}
					</ScText>

					<div
						css={css`
							margin-top: var(--sc-spacing-small);
						`}
					>
						<ScText>
							{__(
								'Automatically charge a payment method on file for this customer.',
								'surecart'
							)}
						</ScText>
					</div>
				</ScRadio>
			</ScRadioGroup>

			{invoice?.automatic_collection ? (
				<>
					<PaymentMethods
						open={modal === 'payment'}
						onRequestClose={() => setModal(null)}
						customerId={checkout?.customer_id}
						paymentMethod={paymentMethod}
						setPaymentMethod={setPaymentMethod}
					/>

					{isDraftInvoice && (
						<div>
							<ScButton
								type="primary"
								onClick={() => setModal('payment')}
							>
								{__('Add Payment Method', 'surecart')}
							</ScButton>
						</div>
					)}
				</>
			) : (
				<ScFormControl label={__('Due Date', 'surecart')}>
					<div
						css={css`
							display: flex;
						`}
					>
						<DatePicker
							title={__('Choose a due date', 'surecart')}
							placeholder={__('Due date', 'surecart')}
							currentDate={
								invoice?.due_date
									? new Date(invoice?.due_date * 1000)
									: null
							}
							onChoose={(due_date) => {
								updateInvoice({
									due_date: Date.parse(due_date) / 1000,
								});
							}}
						/>

						{!!invoice?.due_date && (
							<ScButton
								type="text"
								onClick={() =>
									updateInvoice({ due_date: null })
								}
								css={css`
									max-width: 25px;
								`}
							>
								<ScIcon name="x"></ScIcon>
							</ScButton>
						)}
					</div>
				</ScFormControl>
			)}
		</Box>
	);
};
