/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch, select } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import {
	ScFormatNumber,
	ScLineItem,
	ScCouponForm,
	ScDivider,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import expand from '../checkout-query';
import PaymentCollection from './PaymentCollection';
import { formatTaxDisplay } from '../../util/tax';

export default ({
	invoice,
	updateInvoice,
	onUpdateInvoiceEntityRecord,
	checkout,
	loading,
	setBusy,
	paymentMethod,
	setPaymentMethod,
}) => {
	const isDraftInvoice = invoice?.status === 'draft';
	const { createErrorNotice } = useDispatch(noticesStore);

	const selectedShippingMethod = (
		checkout?.shipping_choices?.data || []
	)?.find(
		({ id }) => checkout?.selected_shipping_choice === id
	)?.shipping_method;

	const onCouponChange = async (e) => {
		try {
			setBusy(true);
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'draft-checkout'
			);

			const data = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${checkout?.id}`, {
					expand,
				}),
				data: {
					discount: {
						promotion_code: e?.detail,
					},
				},
			});

			onUpdateInvoiceEntityRecord({
				...invoice,
				checkout: data,
			});
		} catch (e) {
			console.error(e);
			createErrorNotice(e);
		} finally {
			setBusy(false);
		}
	};

	const renderPaymentDetails = () => {
		return (
			<>
				<ScLineItem>
					<span slot="description">{__('Subtotal', 'surecart')}</span>
					<ScFormatNumber
						slot="price"
						style={{
							fontWeight: 'var(--sc-font-weight-semibold)',
							color: 'var(--sc-color-gray-800)',
						}}
						type="currency"
						currency={checkout?.currency}
						value={checkout?.subtotal_amount}
					></ScFormatNumber>
				</ScLineItem>

				{!!checkout?.shipping_amount && (
					<ScLineItem>
						<span slot="description">
							{__('Shipping', 'surecart')}

							{!!selectedShippingMethod?.name && (
								<div>
									<span
										style={{
											color: 'var(--sc-color-gray-600)',
										}}
									>
										{`${selectedShippingMethod?.name}`}
									</span>

									{!!selectedShippingMethod?.description && (
										<span
											style={{
												fontSize:
													'var(--sc-font-size-small)',
												color: 'var(--sc-color-gray-600)',
											}}
										>
											{` - ${selectedShippingMethod?.description}`}
										</span>
									)}
								</div>
							)}
						</span>
						<ScFormatNumber
							slot="price"
							style={{
								fontWeight: 'var(--sc-font-weight-semibold)',
								color: 'var(--sc-color-gray-800)',
							}}
							type="currency"
							currency={checkout?.currency}
							value={checkout?.shipping_amount}
						></ScFormatNumber>
					</ScLineItem>
				)}

				{!!checkout?.tax_amount && (
					<ScLineItem>
						<span slot="description">{`${formatTaxDisplay(
							__('Order Tax', 'surecart')
						)} (${checkout?.tax_percent}%)`}</span>
						<ScFormatNumber
							slot="price"
							style={{
								fontWeight: 'var(--sc-font-weight-semibold)',
								color: 'var(--sc-color-gray-800)',
							}}
							type="currency"
							currency={checkout?.currency}
							value={checkout?.tax_amount}
						></ScFormatNumber>
					</ScLineItem>
				)}

				{(isDraftInvoice || !!checkout?.discount_amount) && (
					<ScCouponForm
						collapsed={true}
						placeholder={__('Enter Coupon Code', 'surecart')}
						label={__('Add Coupon Code', 'surecart')}
						buttonText={__('Apply', 'surecart')}
						onScApplyCoupon={onCouponChange}
						discount={checkout?.discount}
						currency={checkout?.currency}
						discountAmount={checkout?.discount_amount}
						disabledActions={!isDraftInvoice}
					/>
				)}

				<ScDivider style={{ '--spacing': 'var(--sc-spacing-small)' }} />

				<ScLineItem>
					<span slot="description">{__('Total', 'surecart')}</span>
					<ScFormatNumber
						slot="price"
						style={{
							fontWeight: 'var(--sc-font-weight-semibold)',
							color: 'var(--sc-color-gray-800)',
						}}
						type="currency"
						currency={checkout?.currency}
						value={checkout?.total_amount}
					></ScFormatNumber>
				</ScLineItem>

				{!!checkout?.trial_amount && (
					<ScLineItem>
						<span slot="description">
							{__('Trial', 'surecart')}
						</span>
						<ScFormatNumber
							slot="price"
							style={{
								fontWeight: 'var(--sc-font-weight-semibold)',
								color: 'var(--sc-color-gray-800)',
							}}
							type="currency"
							currency={checkout?.currency}
							value={checkout?.trial_amount}
						></ScFormatNumber>
					</ScLineItem>
				)}

				{checkout?.total_amount !== checkout?.amount_due && (
					<ScLineItem>
						<span slot="title">{__('Amount Due', 'surecart')}</span>
						<ScFormatNumber
							slot="price"
							style={{
								fontWeight: 'var(--sc-font-weight-semibold)',
								color: 'var(--sc-color-gray-800)',
							}}
							type="currency"
							currency={checkout?.currency}
							value={checkout?.amount_due}
						></ScFormatNumber>
					</ScLineItem>
				)}
			</>
		);
	};

	return (
		<>
			<Box title={__('Payment', 'surecart')} loading={loading}>
				{renderPaymentDetails()}
			</Box>

			<PaymentCollection
				invoice={invoice}
				updateInvoice={updateInvoice}
				checkout={checkout}
				loading={loading}
				setBusy={setBusy}
				paymentMethod={paymentMethod}
				setPaymentMethod={setPaymentMethod}
				isDraftInvoice={isDraftInvoice}
			/>
		</>
	);
};
