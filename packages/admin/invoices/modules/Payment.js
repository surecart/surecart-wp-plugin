/** @jsx jsx */
/**
 * External dependencies.
 */
import { css, jsx } from '@emotion/react';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScFormatNumber,
	ScLineItem,
	ScDivider,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import PaymentCollection from './PaymentCollection';
import { formatTaxDisplay } from '../../util/tax';
import { useInvoice } from '../hooks/useInvoice';
import LineItem from './LineItem';
import Coupon from './Coupon';

export default ({ paymentMethod, setPaymentMethod }) => {
	const { checkout, loading } = useInvoice();

	const selectedShippingMethod = (
		checkout?.shipping_choices?.data || []
	)?.find(
		({ id }) => checkout?.selected_shipping_choice === id
	)?.shipping_method;

	return (
		<>
			<Box
				title={__('Payment', 'surecart')}
				loading={loading}
				footer={
					<div
						css={css`
							width: 100%;
							display: grid;
							gap: var(--sc-spacing-small);
						`}
					>
						{/* Total */}
						<LineItem
							title={__('Total', 'surecart')}
							currency={checkout?.currency}
							value={checkout?.total_amount}
						/>

						{/* Proration */}
						{!!checkout?.proration_amount && (
							<LineItem
								label={__('Proration', 'surecart')}
								currency={checkout?.currency}
								value={checkout?.proration_amount}
							/>
						)}

						{/* Applied Balance */}
						{!!checkout?.applied_balance_amount && (
							<LineItem
								label={__('Applied Balance', 'surecart')}
								currency={checkout?.currency}
								value={checkout?.applied_balance_amount}
							/>
						)}

						{/* Credited Balance */}
						{!!checkout?.credited_balance_amount && (
							<LineItem
								label={__('Credited Balance', 'surecart')}
								currency={checkout?.currency}
								value={checkout?.credited_balance_amount}
							/>
						)}

						{/* Amount Due */}
						{checkout?.amount_due !== checkout?.total_amount && (
							<LineItem
								title={__('Amount Due', 'surecart')}
								currency={checkout?.currency}
								value={checkout?.amount_due}
							/>
						)}

						{checkout?.paid_amount > 0 && (
							<LineItem
								title={__('Paid', 'surecart')}
								currency={checkout?.currency}
								value={checkout?.paid_amount}
							/>
						)}

						{!!checkout?.refunded_amount && (
							<>
								<LineItem
									label={__('Refunded', 'surecart')}
									currency={checkout?.currency}
									value={checkout?.refunded_amount}
								/>

								<LineItem
									title={__('Net Payment', 'surecart')}
									currency={checkout?.currency}
									value={checkout?.net_paid_amount}
								/>
							</>
						)}

						{checkout?.tax_reverse_charged_amount > 0 && (
							<LineItem
								label={__(
									'*Tax to be paid on reverse charge basis',
									'surecart'
								)}
							/>
						)}
					</div>
				}
			>
				{/* Subtotal */}
				{checkout?.subtotal_amount !== checkout?.total_amount && (
					<LineItem
						label={__('Subtotal', 'surecart')}
						currency={checkout?.currency}
						value={checkout?.subtotal_amount}
					/>
				)}

				{/* Trial */}
				{!!checkout?.trial_amount && (
					<LineItem
						label={__('Trial', 'surecart')}
						currency={checkout?.currency}
						value={checkout?.trial_amount}
					/>
				)}

				{/* Coupon */}
				<Coupon />

				{/* Shipping */}
				{!!checkout?.shipping_amount && (
					<LineItem
						label={`${__('Shipping', 'surecart')} ${
							selectedShippingMethod?.name
								? `(${selectedShippingMethod?.name})`
								: ''
						}`}
						currency={checkout?.currency}
						value={checkout?.shipping_amount}
					/>
				)}

				{/* Tax */}
				{!!checkout?.tax_amount && (
					<ScLineItem>
						<span slot="description">{`${formatTaxDisplay(
							checkout?.tax_label,
							checkout?.tax_status === 'estimated'
						)} (${checkout?.tax_percent}%)`}</span>
						<ScFormatNumber
							slot="price"
							style={{
								fontWeight: 'var(--sc-font-weight-semibold)',
								color: 'var(--sc-color-gray-800)',
							}}
							type="currency"
							currency={checkout?.currency}
							value={
								checkout?.tax_exclusive_amount ||
								checkout?.tax_inclusive_amount
							}
						/>
						{!!checkout?.tax_inclusive_amount && (
							<span slot="price-description">
								{`(${__('included', 'surecart')})`}
							</span>
						)}
					</ScLineItem>
				)}
			</Box>

			<PaymentCollection
				paymentMethod={paymentMethod}
				setPaymentMethod={setPaymentMethod}
			/>
		</>
	);
};
