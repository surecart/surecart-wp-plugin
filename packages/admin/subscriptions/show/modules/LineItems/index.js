import Box from '../../../../ui/Box';
import { intervalString } from '../../../../util/translations';
import LineItem from './LineItem';
import {
	ScDivider,
	ScFormatDate,
	ScFormatNumber,
	ScLineItem,
	ScProductLineItem,
} from '@surecart/components-react';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default ({ period, loading }) => {
	const checkout = period?.checkout;
	const subscription = period?.subscription;
	const line_items = period?.checkout?.line_items?.data;

	return (
		<Box
			title={__('Upcoming Billing Period', 'surecart')}
			loading={loading}
			header_action={
				!!period?.start_at && (
					<div>
						{__('Bills on', 'surecart')}{' '}
						<ScFormatDate
							type="timestamp"
							date={period?.start_at}
							month="short"
							day="numeric"
							year="numeric"
						></ScFormatDate>
					</div>
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

				{!!checkout?.trial_amount && (
					<LineItem
						label={__('Trial', 'surecart')}
						currency={checkout?.currency}
						value={checkout?.trial_amount}
					/>
				)}

				{!!checkout?.discounts && (
					<LineItem
						label={__('Discounts', 'surecart')}
						currency={checkout?.currency}
						value={checkout?.discount_amount}
					/>
				)}

				{!!checkout?.bump_amount && (
					<LineItem
						label={__('Bump Discounts', 'surecart')}
						currency={checkout?.currency}
						value={checkout?.bump_amount}
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
