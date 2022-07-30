/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { Fragment } from '@wordpress/element';
import Box from '../../../ui/Box';
import { intervalString } from '../../../util/translations';
import { ScButton, ScLineItem } from '@surecart/components-react';
import LineItem from './LineItem';

export default ({ order, checkout, charge, loading }) => {
	const line_items = checkout?.line_items?.data;

	const renderLoading = () => {
		return <sc-skeleton></sc-skeleton>;
	};

	return (
		<Box
			title={__('Order Details', 'surecart')}
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
							type="default"
							size="small"
						>
							{__('Download Receipt', 'surecart')}
							<sc-icon slot="prefix" name="download"></sc-icon>
						</ScButton>
						<ScButton
							href={order?.pdf_url}
							type="primary"
							size="small"
						>
							{__('Download Invoice', 'surecart')}
							<sc-icon slot="prefix" name="download"></sc-icon>
						</ScButton>
					</div>
				)
			}
			footer={
				!loading &&
				!!charge && (
					<sc-line-item
						style={{
							width: '100%',
							'--price-size': 'var(--sc-font-size-x-large)',
						}}
					>
						<span slot="title">
							{__('Amount Paid', 'surecart')}
						</span>
						<span slot="price">
							<sc-format-number
								type="currency"
								currency={charge?.currency}
								value={
									charge?.amount
										? charge?.amount -
										  charge?.refunded_amount
										: 0
								}
							></sc-format-number>
						</span>
						<span slot="currency">{charge?.currency}</span>
					</sc-line-item>
				)
			}
		>
			{loading ? (
				renderLoading()
			) : (
				<Fragment>
					{(line_items || []).map((item) => {
						return (
							<sc-product-line-item
								key={item.id}
								imageUrl={
									item?.price?.metadata?.wp_attachment_src
								}
								name={item?.price?.product?.name}
								editable={false}
								removable={false}
								quantity={item.quantity}
								amount={item.subtotal_amount}
								currency={item?.price?.currency}
								trialDurationDays={
									item?.price?.trial_duration_days
								}
								interval={intervalString(item?.price)}
							></sc-product-line-item>
						);
					})}

					<hr />

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

					{!!checkout?.discounts && (
						<LineItem
							label={__('Discounts', 'surecart')}
							currency={checkout?.currency}
							value={checkout?.discount_amount}
						/>
					)}

					{!!checkout?.tax && (
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

					<hr />

					<sc-line-item
						style={{
							width: '100%',
							'--price-size': 'var(--sc-font-size-x-large)',
						}}
					>
						<span slot="title">{__('Total Due', 'surecart')}</span>
						<span slot="price">
							<sc-format-number
								type="currency"
								currency={checkout?.currency}
								value={checkout?.amount_due}
							></sc-format-number>
						</span>
						<span slot="currency">{checkout?.currency}</span>
					</sc-line-item>

					{!!charge?.refunded_amount && (
						<sc-line-item
							style={{
								width: '100%',
							}}
						>
							<span slot="description">
								{__('Refunded', 'surecart')}
							</span>
							<span slot="price">
								-
								<sc-format-number
									type="currency"
									currency={charge?.currency}
									value={charge?.refunded_amount}
								></sc-format-number>
							</span>
						</sc-line-item>
					)}
				</Fragment>
			)}
		</Box>
	);
};
