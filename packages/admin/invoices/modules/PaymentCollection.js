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
	ScFormatDate,
	ScFormControl,
	ScIcon,
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

	const renderCollectedPayment = () => {
		if (invoice?.status !== 'paid') return null;

		return (
			<ScText tag="span">
				{__('Charged from customer on ', 'surecart')}{' '}
				{checkout?.paid_at ? (
					<>
						<ScFormatDate
							date={checkout?.paid_at}
							type="timestamp"
							month="long"
							day="numeric"
							year="numeric"
						/>

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
				{__('Request by payment due by ', 'surecart')}{' '}
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
		);
	};

	const renderDraftModePaymentCollection = () => {
		return (
			<>
				<ScRadioGroup
					onScChange={(e) =>
						updateInvoice({
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

							{!invoice?.automatic_collection && (
								<div
									css={css`
										margin-top: var(--sc-spacing-medium);
									`}
								>
									<ScFormControl
										label={__(
											'Payment Due Date',
											'surecart'
										)}
									>
										<div
											css={css`
												display: flex;
												margin-top: var(
													--sc-spacing-small
												);
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
															Date.parse(
																due_date
															) / 1000,
													});
												}}
												onClear={() =>
													updateInvoice({
														due_date: null,
													})
												}
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
								<div>
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
							<ScButton
								type="primary"
								onClick={() => setModal('payment')}
							>
								{__('Add Payment Method', 'surecart')}
							</ScButton>
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
