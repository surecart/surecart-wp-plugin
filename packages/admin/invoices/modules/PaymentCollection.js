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
import {
	ScButton,
	ScFormatDate,
	ScFormControl,
	ScIcon,
	ScRadio,
	ScRadioGroup,
	ScText,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import PaymentMethods from './PaymentMethods';
import DatePicker from '../../components/DatePicker';

export default ({
	invoice,
	updateInvoice,
	checkout,
	loading,
	paymentMethod,
	setPaymentMethod,
}) => {
	const [modal, setModal] = useState(false);
	const isDraftInvoice = invoice?.status === 'draft';

	const renderViewModePaymentCollections = () => {
		return (
			<ScText>
				{invoice?.automatic_collection && (
					<ScText tag="span">
						{__('Will be Autocharge From Customer', 'surecart')}
					</ScText>
				)}

				{!invoice?.automatic_collection && (
					<ScText tag="span">
						{__('Request By Payment due by ', 'surecart')}{' '}
						{invoice?.due_date ? (
							<ScFormatDate
								date={invoice?.due_date}
								type="timestamp"
								month="long"
								day="numeric"
								year="numeric"
							/>
						) : (
							'-'
						)}
					</ScText>
				)}
			</ScText>
		);
	};

	const renderDraftModelPaymentCollection = () => {
		return (
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

						{!invoice?.automatic_collection && (
							<div
								css={css`
									margin-top: var(--sc-spacing-medium);
								`}
							>
								<ScFormControl
									label={__('Payment Due Date', 'surecart')}
								>
									<div
										css={css`
											display: flex;
											margin-top: var(--sc-spacing-small);
										`}
									>
										<DatePicker
											title={__(
												'Choose a due date',
												'surecart'
											)}
											placeholder={__(
												'Due date',
												'surecart'
											)}
											currentDate={
												invoice?.due_date
													? new Date(
															invoice?.due_date *
																1000
													  )
													: null
											}
											onChoose={(due_date) => {
												updateInvoice({
													due_date:
														Date.parse(due_date) /
														1000,
												});
											}}
										/>

										{!!invoice?.due_date && (
											<ScButton
												type="text"
												onClick={() =>
													updateInvoice({
														due_date: null,
													})
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
							</div>
						)}
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

						{invoice?.automatic_collection && (
							<div
								css={css`
									margin-top: var(--sc-spacing-medium);
								`}
							>
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
											{__(
												'Add Payment Method',
												'surecart'
											)}
										</ScButton>
									</div>
								)}
							</div>
						)}
					</div>
				</ScRadio>
			</ScRadioGroup>
		);
	};

	const renderPaymentCollection = () => {
		if (isDraftInvoice) {
			return renderDraftModelPaymentCollection();
		}

		return renderViewModePaymentCollections();
	};

	return (
		<Box
			loading={loading}
			css={css`
				margin-top: var(--sc-spacing-medium);
			`}
			title={__('Payment Collection', 'surecart')}
		>
			{renderPaymentCollection()}
		</Box>
	);
};
