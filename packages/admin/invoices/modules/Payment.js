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
						{checkout?.full_amount > checkout?.total_amount && (
							<LineItem
								label={__('Total Amount', 'surecart')}
								currency={checkout?.currency}
								value={checkout?.full_amount}
							/>
						)}
						<ScLineItem>
							<span slot="title">
								{__('Amount Due', 'surecart')}
							</span>
							<ScFormatNumber
								slot="price"
								style={{
									fontWeight:
										'var(--sc-font-weight-semibold)',
									color: 'var(--sc-color-gray-800)',
								}}
								type="currency"
								currency={checkout?.currency}
								value={checkout?.remaining_amount_due}
							></ScFormatNumber>
						</ScLineItem>
					</div>
				}
			>
				<LineItem
					label={__('Subtotal', 'surecart')}
					currency={checkout?.currency}
					value={checkout?.subtotal_amount}
				/>

				{!!checkout?.proration_amount && (
					<LineItem
						label={__('Proration', 'surecart')}
						currency={checkout?.currency}
						value={checkout?.proration_amount}
					/>
				)}

				{!!checkout?.applied_balance_amount && (
					<LineItem
						label={__('Applied Balance', 'surecart')}
						currency={checkout?.currency}
						value={checkout?.applied_balance_amount}
					/>
				)}

				<Coupon />

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
			</Box>

			<PaymentCollection
				paymentMethod={paymentMethod}
				setPaymentMethod={setPaymentMethod}
			/>
		</>
	);
};
