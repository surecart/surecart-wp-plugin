/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import Box from '../../ui/Box';
import { translateInterval } from '../../util/translations';
import Definition from '../../ui/Definition';
import { useSelect } from '@wordpress/data';
import { store } from '@surecart/data';
import { ScButton } from '@surecart/components-react';

export default ({ invoice, charge: chargeInput, loading }) => {
	const line_items = invoice?.invoice_items?.data;

	const charge = useSelect(
		(select) => select(store).selectModel('charge', chargeInput?.id) || {},
		[chargeInput]
	);

	const renderLoading = () => {
		return <sc-skeleton></sc-skeleton>;
	};

	return (
		<Box
			title={__('Invoice Details', 'surecart')}
			header_action={
				invoice?.id && (
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
							href={`${scData?.surecart_app_url}/portal/invoices/${invoice?.id}/generate/receipt.pdf`}
							type="default"
							size="small"
						>
							{__('Download Receipt', 'surecart')}
							<sc-icon slot="prefix" name="download"></sc-icon>
						</ScButton>
						<ScButton
							href={`${scData?.surecart_app_url}/portal/invoices/${invoice?.id}/generate.pdf`}
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
								amount={item.price.amount}
								currency={item?.price?.currency}
								trialDurationDays={
									item?.price?.trial_duration_days
								}
								interval={translateInterval(
									item?.price?.recurring_interval_count,
									item?.price?.recurring_interval
								)}
							></sc-product-line-item>
						);
					})}

					<hr />

					<Definition title={__('Subtotal', 'surecart')}>
						<sc-format-number
							style={{
								'font-weight': 'var(--sc-font-weight-semibold)',
								color: 'var(--sc-color-gray-800)',
							}}
							type="currency"
							currency={invoice?.currency}
							value={invoice?.subtotal_amount}
						></sc-format-number>
					</Definition>
					<Definition title={__('Discounts', 'surecart')}>
						<sc-format-number
							style={{
								'font-weight': 'var(--sc-font-weight-semibold)',
								color: 'var(--sc-color-gray-800)',
							}}
							type="currency"
							currency={invoice?.currency}
							value={invoice?.discount_amount}
						></sc-format-number>
					</Definition>
					{!!invoice?.proration_amount && (
						<Definition title={__('Proration Credit', 'surecart')}>
							<sc-format-number
								style={{
									'font-weight':
										'var(--sc-font-weight-semibold)',
									color: 'var(--sc-color-gray-800)',
								}}
								type="currency"
								currency={invoice?.currency}
								value={invoice?.proration_amount}
							></sc-format-number>
						</Definition>
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
								currency={invoice?.currency}
								value={invoice?.amount_due}
							></sc-format-number>
						</span>
						<span slot="currency">{invoice?.currency}</span>
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
