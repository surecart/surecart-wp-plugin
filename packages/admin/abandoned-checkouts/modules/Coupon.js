import {
	ScFormatDate,
	ScFormatNumber,
	ScLineItem,
	ScTag,
} from '@surecart/components-react';
import { sprintf, __ } from '@wordpress/i18n';
import Box from '../../ui/Box';

export default ({ promotion, coupon }) => {
	if (!promotion || !coupon) {
		return null;
	}

	const renderDiscount = () => {
		if (coupon?.amount_off) {
			return (
				<ScFormatNumber
					type="currency"
					currency={coupon?.currency || 'usd'}
					value={coupon?.amount_off}
				/>
			);
		}
		return sprintf(__('%d%% off', 'surecart'), coupon?.percent_off || 0);
	};

	return (
		<Box title={__('Discount', 'surecart')}>
			<ScLineItem>
				<span slot="description">{__('Discount', 'surecart')}</span>
				<span slot="price">{renderDiscount()}</span>
			</ScLineItem>

			{!!promotion?.code && (
				<ScLineItem>
					<span slot="description">{__('Code', 'surecart')}</span>
					<span slot="price">{promotion?.code}</span>
				</ScLineItem>
			)}

			<ScLineItem>
				<span slot="description">{__('Status', 'surecart')}</span>
				{promotion?.times_redeemed ? (
					<ScTag type="success" slot="price">
						{__('Redeemed', 'surecart')}
					</ScTag>
				) : (
					<ScTag slot="price">{__('Not Redeemed', 'surecart')}</ScTag>
				)}
			</ScLineItem>

			{!!promotion?.redeem_by && (
				<ScLineItem>
					<span slot="description">
						{__('Redeem By', 'surecart')}
					</span>
					<ScFormatDate
						slot="price"
						type="timestamp"
						date={promotion?.redeem_by}
						month="short"
						day="numeric"
						year="numeric"
						hour="numeric"
						minute="numeric"
					/>
				</ScLineItem>
			)}
		</Box>
	);
};
