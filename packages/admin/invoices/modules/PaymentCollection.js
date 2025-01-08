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
	ScDropdown,
	ScFormControl,
	ScIcon,
	ScInput,
	ScManualPaymentMethod,
	ScMenu,
	ScMenuItem,
	ScPaymentMethod,
	ScRadio,
	ScRadioGroup,
	ScText,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import PaymentMethods from './PaymentMethods';
import PaymentCollectionDueDate from '../components/PaymentCollectionDueDate';
import { useInvoice } from '../hooks/useInvoice';
import { formatDate } from '../../util/time';

export default ({ paymentMethod, setPaymentMethod }) => {
	const { invoice, checkout, loading, editInvoice, isDraftInvoice } =
		useInvoice();
	const [modal, setModal] = useState(false);

	const renderCollectedPayment = () => {
		if (invoice?.status !== 'paid') return null;

		return (
			<ScText tag="span">
				{__('Charged on ', 'surecart')}{' '}
				{checkout?.paid_at ? (
					<>
						{checkout?.paid_at_date}

						{!!paymentMethod?.id && !checkout?.manual_payment && (
							<div
								style={{
									display: 'flex',
									width: '100%',
									justifyContent: 'space-between',
									alignItems: 'center',
									marginTop: '1em',
								}}
							>
								<ScPaymentMethod
									paymentMethod={paymentMethod}
								/>

								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: '2em',
									}}
								>
									{!!paymentMethod?.card?.exp_month && (
										<span>
											{__('Exp.', 'surecart')}
											{paymentMethod?.card?.exp_month}/
											{paymentMethod?.card?.exp_year}
										</span>
									)}
									{!!paymentMethod?.paypal_account?.email &&
										paymentMethod?.paypal_account?.email}
								</div>
							</div>
						)}

						{!!paymentMethod?.id && checkout?.manual_payment && (
							<ScManualPaymentMethod
								paymentMethod={paymentMethod}
							/>
						)}
					</>
				) : (
					'-'
				)}
			</ScText>
		);
	};

	const renderViewModePaymentCollection = () => {
		if (invoice?.automatic_collection) {
			if (invoice?.status === 'paid') {
				return renderCollectedPayment();
			}

			return (
				<ScText tag="span">
					{__('Will be autocharged from customer.', 'surecart')}
				</ScText>
			);
		}

		if (invoice?.status === 'paid') {
			return renderCollectedPayment();
		}

		return (
			<ScText tag="span">
				{invoice?.due_date ? (
					<>
						{__('Payment is requested by ', 'surecart')}{' '}
						{formatDate(invoice?.due_date * 1000)}
					</>
				) : (
					__('No due date.', 'surecart')
				)}
			</ScText>
		);
	};

	const renderDraftModePaymentCollection = () => {
		return (
			<>
				<ScRadioGroup
					onScChange={(e) =>
						editInvoice({
							automatic_collection:
								!invoice?.automatic_collection,
						})
					}
				>
					<ScRadio
						value="false"
						checked={!invoice?.automatic_collection}
					>
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

					{!invoice?.automatic_collection && (
						<div
							css={css`
								margin-left: var(--sc-spacing-x-large);
							`}
						>
							<ScFormControl
								label={__('Payment Due Date', 'surecart')}
							>
								<div
									css={css`
										display: flex;
										margin-top: var(--sc-spacing-small);
										margin-bottom: var(--sc-spacing-large);
									`}
								>
									<PaymentCollectionDueDate
										invoice={invoice}
										updateInvoice={editInvoice}
									/>
								</div>
							</ScFormControl>
						</div>
					)}

					<ScRadio
						value="true"
						checked={invoice?.automatic_collection}
					>
						<div>
							<ScText
								tag="h3"
								style={{
									'--font-weight':
										'var(--sc-font-weight-bold)',
									'--font-size': 'var(--sc-font-size-medium)',
								}}
							>
								{__('Autocharge Customer', 'surecart')}
							</ScText>

							<div
								css={css`
									margin-top: var(--sc-spacing-small);
								`}
								slot="description"
							>
								<ScText>
									{__(
										'Automatically charge a payment method on file for this customer.',
										'surecart'
									)}
								</ScText>
							</div>
						</div>
					</ScRadio>
				</ScRadioGroup>

				{invoice?.automatic_collection && (
					<div
						css={css`
							margin-left: var(--sc-spacing-x-large);
						`}
					>
						{!!paymentMethod ? (
							<div
								css={css`
									display: flex;
									justify-content: space-between;
								`}
							>
								<ScPaymentMethod
									paymentMethod={paymentMethod}
								/>
								<div
									css={css`
										margin-right: var(--sc-spacing-small);
									`}
								>
									{!!paymentMethod?.card?.exp_month && (
										<span>
											{__('Exp.', 'surecart')}
											{paymentMethod?.card?.exp_month}/
											{paymentMethod?.card?.exp_year}
										</span>
									)}
									{!!paymentMethod?.paypal_account?.email &&
										paymentMethod?.paypal_account?.email}

									{isDraftInvoice && (
										<ScDropdown placement="bottom-end">
											<ScButton
												type="text"
												slot="trigger"
												circle
											>
												<ScIcon name="more-horizontal" />
											</ScButton>
											<ScMenu>
												<ScMenuItem
													onClick={() =>
														setPaymentMethod(false)
													}
												>
													<ScIcon
														slot="prefix"
														name="trash"
														style={{
															opacity: 0.5,
														}}
													/>
													{__('Remove', 'surecart')}
												</ScMenuItem>
											</ScMenu>
										</ScDropdown>
									)}
								</div>
							</div>
						) : (
							<>
								<ScInput
									required
									css={css`
										width: 0;
										height: 0;
										opacity: 0;
										overflow: hidden;
									`}
								/>
								<ScButton
									type="default"
									onClick={() => setModal('payment')}
								>
									{__('Select Payment Method', 'surecart')}
								</ScButton>
							</>
						)}
					</div>
				)}

				<PaymentMethods
					open={modal === 'payment'}
					onRequestClose={() => setModal(null)}
					customerId={checkout?.customer_id}
					paymentMethod={paymentMethod}
					setPaymentMethod={setPaymentMethod}
				/>
			</>
		);
	};

	const renderPaymentCollection = () => {
		if (isDraftInvoice) {
			return renderDraftModePaymentCollection();
		}

		return renderViewModePaymentCollection();
	};

	return (
		<Box
			loading={loading}
			css={css`
				margin-top: var(--sc-spacing-x-large);
			`}
			title={__('Payment Collection', 'surecart')}
		>
			{renderPaymentCollection()}
		</Box>
	);
};
