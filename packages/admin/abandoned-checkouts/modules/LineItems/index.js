import {
	ScDivider,
	ScFormatNumber,
	ScLineItem,
	ScProductLineItem,
	ScButton,
} from '@surecart/components-react';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

import Box from '../../../ui/Box';
import { formatTaxDisplay } from '../../../util/tax';
import { intervalString } from '../../../util/translations';
import LineItem from './LineItem';

export default ({ checkout, loading, abandoned }) => {
	const line_items = checkout?.line_items?.data;

	return (
		<Box
			title={__('Checkout Details', 'surecart')}
			loading={loading}
			footer={
				abandoned?.recovered_checkout?.order && (
					<ScButton
						size="medium"
						href={addQueryArgs('admin.php', {
							page: 'sc-orders',
							action: 'edit',
							id: abandoned?.recovered_checkout?.order,
						})}
					>
						{__('View Order', 'surecart')}
					</ScButton>
				)
			}
		>
			<Fragment>
				{(line_items || []).map((item) => {
					return (
						<ScProductLineItem
							key={item.id}
							image={item?.image}
							name={item?.price?.product?.name}
							price={item?.price?.name}
							variant={item?.variant_display_options}
							editable={false}
							removable={false}
							fees={item?.fees?.data}
							quantity={item.quantity}
							amount={item.subtotal_display_amount}
							scratch={item.scratch_display_amount}
							trial={item?.price?.trial_text}
							sku={item?.sku}
							note={item?.display_note}
							interval={`${item?.price?.short_interval_text} ${item?.price?.short_interval_count_text}`}
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

				{!!checkout?.shipping_amount && (
					<LineItem
						label={__('Shipping', 'surecart')}
						currency={checkout?.currency}
						value={checkout?.shipping_amount}
					/>
				)}

				{!!checkout?.tax_amount && (
					<LineItem
						label={`${formatTaxDisplay(checkout?.tax_label)} (${
							checkout?.tax_percent
						}%)`}
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
			</Fragment>
		</Box>
	);
};
