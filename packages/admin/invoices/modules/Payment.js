/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScFormatNumber,
	ScLineItem,
	ScDivider,
	ScCouponForm,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import PaymentCollection from './PaymentCollection';
import { formatTaxDisplay } from '../../util/tax';
import { useInvoice } from '../hooks/useInvoice';

export default ({ paymentMethod, setPaymentMethod }) => {
	const { checkout, updateCheckout, loading } = useInvoice();

	const selectedShippingMethod = (
		checkout?.shipping_choices?.data || []
	)?.find(
		({ id }) => checkout?.selected_shipping_choice === id
	)?.shipping_method;

	const onCouponChange = async (e) => {
		await updateCheckout({
			discount: {
				promotion_code: e?.detail,
			},
		});
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

				<ScCouponForm
					collapsed={true}
					placeholder={__('Enter Coupon Code', 'surecart')}
					label={__('Add Coupon Code', 'surecart')}
					buttonText={__('Apply', 'surecart')}
					onScApplyCoupon={onCouponChange}
					discount={checkout?.discount}
					currency={checkout?.currency}
					discountAmount={checkout?.discount_amount}
				/>

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
				paymentMethod={paymentMethod}
				setPaymentMethod={setPaymentMethod}
			/>
		</>
	);
};
