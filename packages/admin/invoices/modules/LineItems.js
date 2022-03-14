/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import Box from '../../ui/Box';
import { translateInterval } from '../../util/translations';
import Definition from '../../ui/Definition';

export default ({ invoice, charge, loading }) => {
	const line_items = invoice?.invoice_items?.data;

	const renderLoading = () => {
		return <ce-skeleton></ce-skeleton>;
	};

	return (
		<Box
			title={__('Invoice Details', 'checkout_engine')}
			footer={
				!loading &&
				!!charge && (
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
								currency={charge?.currency}
								value={charge?.amount - charge?.refunded_amount}
							></ce-format-number>
						</span>
						<span slot="currency">{charge?.currency}</span>
					</ce-line-item>
				)
			}
		>
			{loading ? (
				renderLoading()
			) : (
				<Fragment>
					{(line_items || []).map((item, index) => {
						console.log({ item });
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
								amount={item.price.amount}
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

					<Definition title={__('Subtotal', 'checkout_engine')}>
						<ce-format-number
							style={{
								'font-weight': 'var(--ce-font-weight-semibold)',
								color: 'var(--ce-color-gray-800)',
							}}
							type="currency"
							currency={invoice?.currency}
							value={invoice?.subtotal_amount}
						></ce-format-number>
					</Definition>
					<Definition title={__('Discounts', 'checkout_engine')}>
						<ce-format-number
							style={{
								'font-weight': 'var(--ce-font-weight-semibold)',
								color: 'var(--ce-color-gray-800)',
							}}
							type="currency"
							currency={invoice?.currency}
							value={invoice?.discount_amount}
						></ce-format-number>
					</Definition>
					{!!invoice?.proration_amount && (
						<Definition
							title={__('Proration Credit', 'checkout_engine')}
						>
							<ce-format-number
								style={{
									'font-weight':
										'var(--ce-font-weight-semibold)',
									color: 'var(--ce-color-gray-800)',
								}}
								type="currency"
								currency={invoice?.currency}
								value={invoice?.proration_amount}
							></ce-format-number>
						</Definition>
					)}

					<hr />

					<ce-line-item
						style={{
							width: '100%',
							'--price-size': 'var(--ce-font-size-x-large)',
						}}
					>
						<span slot="title">
							{__('Total Due', 'checkout_engine')}
						</span>
						<span slot="price">
							<ce-format-number
								type="currency"
								currency={invoice?.currency}
								value={invoice?.amount_due}
							></ce-format-number>
						</span>
						<span slot="currency">{invoice?.currency}</span>
					</ce-line-item>

					{!!charge?.refunded_amount && (
						<ce-line-item
							style={{
								width: '100%',
							}}
						>
							<span slot="description">
								{__('Refunded', 'checkout_engine')}
							</span>
							<span slot="price">
								-
								<ce-format-number
									type="currency"
									currency={charge?.currency}
									value={charge?.refunded_amount}
								></ce-format-number>
							</span>
						</ce-line-item>
					)}
				</Fragment>
			)}
		</Box>
	);
};
