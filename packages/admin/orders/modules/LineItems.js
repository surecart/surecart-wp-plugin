/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import Box from '../../ui/Box';
import { translateInterval } from '../../util/translations';
import useLineItemData from '../hooks/useLineItemData';
import useOrderData from '../hooks/useOrderData';
import Definition from '../../ui/Definition';

export default ({ order, loading }) => {
	const line_items = order?.line_items?.data;

	const renderLoading = () => {
		return <ce-skeleton></ce-skeleton>;
	};

	return (
		<Box
			title={__('Order Details', 'checkout_engine')}
			footer={
				!loading && (
					<ce-line-item
						style={{
							width: '100%',
							'--price-size': 'var(--ce-font-size-x-large)',
						}}
					>
						<span slot="title">
							{__('Total', 'checkout_engine')}
						</span>
						<span slot="price">
							<ce-format-number
								type="currency"
								currency={order?.currency}
								value={order?.total_amount}
							></ce-format-number>
						</span>
						<span slot="currency">{order?.currency}</span>
					</ce-line-item>
				)
			}
		>
			{loading ? (
				renderLoading()
			) : (
				<Fragment>
					{(line_items || []).map((item, index) => {
						return (
							<ce-product-line-item
								key={item.id}
								imageUrl={
									item?.price?.metadata?.wp_attachment_src
								}
								name={item?.price?.product?.name}
								editable={false}
								removable={false}
								quantity={item.quantity}
								amount={
									item.ad_hoc_amount !== null
										? item.ad_hoc_amount
										: item.price.amount
								}
								currency={item?.price?.currency}
								trialDurationDays={
									item?.price?.trial_duration_days
								}
								interval={translateInterval(
									item?.price?.recurring_interval_count,
									item?.price?.recurring_interval
								)}
							></ce-product-line-item>
						);
					})}

					<hr />

					<Definition title={__('Subtotal', 'order')}>
						<ce-format-number
							style={{
								'font-weight': 'var(--ce-font-weight-semibold)',
								color: 'var(--ce-color-gray-800)',
							}}
							type="currency"
							currency={order?.currency}
							value={order?.subtotal_amount}
						></ce-format-number>
					</Definition>
					<Definition title={__('Discounts', 'order')}>
						<ce-format-number
							style={{
								'font-weight': 'var(--ce-font-weight-semibold)',
								color: 'var(--ce-color-gray-800)',
							}}
							type="currency"
							currency={order?.currency}
							value={order?.discount_amount}
						></ce-format-number>
					</Definition>

					<hr />

					<ce-line-item
						style={{
							width: '100%',
							'--price-size': 'var(--ce-font-size-x-large)',
						}}
					>
						<span slot="title">
							{__('Amount Paid', 'checkout_engine')}
						</span>
						<span slot="price">
							<ce-format-number
								type="currency"
								currency={order?.currency}
								value={order?.amount_due}
							></ce-format-number>
						</span>
						<span slot="currency">{order?.currency}</span>
					</ce-line-item>
				</Fragment>
			)}
		</Box>
	);
};
