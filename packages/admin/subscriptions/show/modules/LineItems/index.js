import Box from '../../../../ui/Box';
import { intervalString } from '../../../../util/translations';
import LineItem from './LineItem';
import {
	ScDivider,
	ScFormatNumber,
	ScLineItem,
	ScProductLineItem,
} from '@surecart/components-react';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { formatTaxDisplay } from '../../../../util/tax';
import { getVariantLabel } from '../../../../util/variation';

export default ({ period, loading }) => {
	const checkout = period?.checkout;
	const line_items = period?.checkout?.line_items?.data;

	return (
		<Box
			title={__('Upcoming Billing Period', 'surecart')}
			loading={loading}
			header_action={
				!!period?.start_at && (
					<div>
						{__('Bills on', 'surecart')} {period?.start_at_date}
					</div>
				)
			}
		>
			<Fragment>
				{(line_items || []).map((item) => {
					return (
						<>
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
						</>
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

				{!!checkout?.trial_amount && (
					<LineItem
						label={__('Trial', 'surecart')}
						currency={checkout?.currency}
						value={checkout?.trial_amount}
					/>
				)}

				{!!checkout?.discount_amount && (
					<LineItem
						label={__('Discounts', 'surecart')}
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
					<span slot="title">{__('Amount Due', 'surecart')}</span>
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
