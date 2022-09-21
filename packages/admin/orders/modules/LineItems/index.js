import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScDivider,
	ScFormatNumber,
	ScIcon,
	ScLineItem,
	ScProductLineItem,
	ScSkeleton,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/** @jsx jsx */
import Box from '../../../ui/Box';
import { intervalString } from '../../../util/translations';
import LineItem from './LineItem';

export default ({ order, checkout, loading }) => {
	const line_items = checkout?.line_items?.data;

	const { charge, loadedCharge } = useSelect(
		(select) => {
			if (!checkout?.id) {
				return {
					charge: {},
					loading: true,
				};
			}
			const entityData = [
				'surecart',
				'charge',
				{
					checkout_ids: checkout?.id ? [checkout?.id] : null,
					expand: [
						'payment_method',
						'payment_method.card',
						'payment_method.payment_instrument',
						'payment_method.paypal_account',
						'payment_method.bank_account',
					],
				},
			];
			return {
				charge: select(coreStore)?.getEntityRecords?.(
					...entityData
				)?.[0],
				loadedCharge: select(coreStore)?.hasFinishedResolution?.(
					'getEntityRecords',
					[...entityData]
				),
			};
		},
		[checkout?.id]
	);

	return (
		<Box
			title={__('Order Details', 'surecart')}
			loading={loading}
			header_action={
				order?.pdf_url && (
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
							href={addQueryArgs(order?.pdf_url, {
								receipt: true,
							})}
							type="primary"
							size="small"
						>
							{__('Download Receipt / Invoice', 'surecart')}
							<ScIcon slot="prefix" name="download"></ScIcon>
						</ScButton>
					</div>
				)
			}
			footer={
				!loadedCharge ? (
					<ScLineItem
						style={{
							width: '100%',
						}}
					>
						<ScSkeleton slot="title"></ScSkeleton>
						<ScSkeleton slot="price"></ScSkeleton>
					</ScLineItem>
				) : (
					(!!charge?.amount || !!charge?.refunded_amount) && (
						<ScLineItem
							style={{
								width: '100%',
								'--price-size': 'var(--sc-font-size-x-large)',
							}}
						>
							<span slot="title">
								{charge?.refunded_amount
									? __('Net Payment', 'surecart')
									: __('Paid', 'surecart')}
							</span>

							<ScFormatNumber
								slot="price"
								type="currency"
								currency={charge?.currency}
								value={
									charge?.amount
										? charge?.amount -
										  charge?.refunded_amount
										: 0
								}
							></ScFormatNumber>
							<span slot="currency">{charge?.currency}</span>
						</ScLineItem>
					)
				)
			}
		>
			<Fragment>
				{(line_items || []).map((item) => {
					return (
						<ScProductLineItem
							key={item.id}
							imageUrl={item?.price?.metadata?.wp_attachment_src}
							name={item?.price?.product?.name}
							editable={false}
							removable={false}
							quantity={item.quantity}
							amount={item.subtotal_amount}
							currency={item?.price?.currency}
							trialDurationDays={item?.price?.trial_duration_days}
							interval={intervalString(item?.price)}
						></ScProductLineItem>
					);
				})}

				<ScDivider
					style={{ '--spacing': 'var(--sc-spacing-x-small)' }}
				/>

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

				{!!checkout?.tax_amount && (
					<LineItem
						label={
							<>
								{__('Tax', 'surecart')} -{' '}
								{checkout?.tax_percent}%
							</>
						}
						currency={checkout?.currency}
						value={checkout?.tax_amount}
					/>
				)}

				<ScDivider style={{ '--spacing': 'var(--sc-spacing-small)' }} />

				<ScLineItem
					style={{
						width: '100%',
						'--price-size': 'var(--sc-font-size-x-large)',
					}}
				>
					<span slot="title">{__('Total', 'surecart')}</span>
					<span slot="price">
						<ScFormatNumber
							type="currency"
							currency={checkout?.currency}
							value={checkout?.amount_due}
						></ScFormatNumber>
					</span>
					<span slot="currency">{checkout?.currency}</span>
				</ScLineItem>

				{!!charge?.refunded_amount && (
					<ScLineItem
						style={{
							width: '100%',
						}}
					>
						<span slot="description">
							{__('Refunded', 'surecart')}
						</span>
						<span slot="price">
							-
							<ScFormatNumber
								type="currency"
								currency={charge?.currency}
								value={charge?.refunded_amount}
							></ScFormatNumber>
						</span>
					</ScLineItem>
				)}
			</Fragment>
		</Box>
	);
};
