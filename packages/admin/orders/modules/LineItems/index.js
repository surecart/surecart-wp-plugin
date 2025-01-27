/** @jsx jsx */

/**
 * External dependencies.
 */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScDivider,
	ScFormatNumber,
	ScIcon,
	ScLineItem,
	ScProductLineItem,
} from '@surecart/components-react';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { useEntityRecords } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import Box from '../../../ui/Box';
import { formatTaxDisplay } from '../../../util/tax';
import { intervalString } from '../../../util/translations';
import LineItem from './LineItem';
import { getSKUText } from '../../../util/products';
import RefundLineItem from '../Refund/RefundLineItem';

const status = {
	processing: __('Processing', 'surecart'),
	payment_failed: __('Payment Failed', 'surecart'),
	paid: __('Paid', 'surecart'),
	canceled: __('Canceled', 'surecart'),
	void: __('Canceled', 'surecart'),
	draft: __('Draft', 'surecart'),
};

export default ({ order, checkout }) => {
	const line_items = checkout?.line_items?.data;

	// get the refunds.
	const { records: refunds, hasResolved } = useEntityRecords(
		'surecart',
		'refund',
		{
			context: 'edit',
			charge_ids: [order?.checkout?.charge?.id],
			per_page: 100,
			expand: ['refund_items', 'refund_item.line_item'],
		}
	);

	const statusBadge = () => {
		if (!order?.status) {
			return null;
		}

		if (order?.status === 'paid') {
			return (
				<ScIcon
					css={css`
						font-size: 22px;
						color: var(--sc-color-success-500);
					`}
					name="check-circle"
				/>
			);
		}

		if (order?.status === 'void' || order?.status === 'payment_failed') {
			return (
				<ScIcon
					css={css`
						font-size: 22px;
						color: var(--sc-color-danger-500);
					`}
					name="x-circle"
				/>
			);
		}

		return (
			<ScIcon
				css={css`
					font-size: 22px;
					color: var(--sc-color-warning-500);
				`}
				name="circle"
			/>
		);
	};

	const selectedShippingMethod = (
		checkout?.shipping_choices?.data || []
	)?.find(
		({ id }) => checkout?.selected_shipping_choice === id
	)?.shipping_method;

	return (
		<Box
			title={
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					{statusBadge()}
					{status[order?.status] || order?.status}
				</div>
			}
			loading={!hasResolved}
			header_action={
				order?.statement_url && (
					<div
						css={css`
							display: flex;
							gap: 0.5em;
							align-items: center;
							justify-content: flex-end;
							flex-wrap: wrap;
						`}
					>
						<ScButton
							href={addQueryArgs(order?.statement_url, {
								receipt: true,
							})}
							type="default"
							size="small"
						>
							{__('Download Receipt / Invoice', 'surecart')}
							<ScIcon slot="prefix" name="download"></ScIcon>
						</ScButton>
					</div>
				)
			}
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

					<ScDivider
						style={{ '--spacing': 'var(--sc-spacing-small)' }}
					/>

					{checkout?.paid_amount > 0 && (
						<LineItem
							title={__('Paid', 'surecart')}
							currency={checkout?.currency}
							value={checkout?.paid_amount}
						/>
					)}

					{!!checkout?.refunded_amount &&
						(refunds || []).map((refund, index) => (
							<RefundLineItem
								key={refund.id}
								order={order}
								refund={refund}
								label={
									index === 0 ? (
										<>{__('Refunded', 'surecart')}</>
									) : (
										''
									)
								}
							/>
						))}

					<LineItem
						title={__('Net Payment', 'surecart')}
						currency={checkout?.currency}
						value={checkout?.net_paid_amount}
					/>

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
			<Fragment>
				{(line_items || []).map((item) => {
					return (
						<ScProductLineItem
							key={item.id}
							image={item?.image}
							name={item?.price?.product?.name}
							priceName={item?.price?.name}
							variantLabel={
								(item?.variant_options || [])
									.filter(Boolean)
									.join(' / ') || null
							}
							editable={false}
							removable={false}
							fees={item?.fees?.data}
							quantity={item.quantity}
							amount={item.subtotal_amount}
							currency={item?.price?.currency}
							trialDurationDays={item?.price?.trial_duration_days}
							interval={intervalString(item?.price)}
							sku={getSKUText(item)}
						></ScProductLineItem>
					);
				})}

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

				{!!checkout?.discount_amount && (
					<LineItem
						label={
							<>
								{__('Discounts', 'surecart')}{' '}
								{checkout?.discount?.promotion?.code && (
									<>
										<br />
										<sc-tag type="success">
											{__('Coupon:', 'surecart')}{' '}
											{
												checkout?.discount?.promotion
													?.code
											}
										</sc-tag>
									</>
								)}
							</>
						}
						currency={checkout?.currency}
						value={checkout?.discount_amount}
					/>
				)}

				{/* Shipping */}
				{!!checkout?.shipping_amount && (
					<span>
						<LineItem
							label={`${__('Shipping', 'surecart')} ${
								selectedShippingMethod?.name
									? `(${selectedShippingMethod?.name})`
									: ''
							}`}
							currency={checkout?.currency}
							value={checkout?.shipping_amount}
						/>
						{checkout?.selected_shipping_choice?.shipping_method
							?.name && (
							<span
								css={css`
									font-size: var(--sc-font-size-small);
									line-height: var(--sc-line-height-dense);
									color: var(--sc-input-label-color);
								`}
							>
								{`(${checkout?.selected_shipping_choice?.shipping_method?.name})`}
							</span>
						)}
					</span>
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
			</Fragment>
		</Box>
	);
};
