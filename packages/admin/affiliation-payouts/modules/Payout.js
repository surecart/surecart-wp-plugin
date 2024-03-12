/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
	ScButton,
	ScFlex,
	ScFormatDate,
	ScFormatNumber,
	ScOrderStatusBadge,
} from '@surecart/components-react';
import Box from '../../ui/Box';

import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import Definition from '../../ui/Definition';

export default ({ referral, loading }) => {
	const renderPayoutDisplay = () => {
		const payout = referral?.payout;
		<ScFlex alignItems="center" justifyContent="space-between">
			<div>
				<Definition title={__('Commission', 'surecart')}>
					<ScFormatNumber
						value={payout?.total_commission_amount}
						type="currency"
						currency={payout?.currency}
					/>
				</Definition>
				<Definition title={__('Period End', 'surecart')}>
					<ScFormatDate
						type="timestamp"
						month="short"
						day="numeric"
						year="numeric"
						date={payout?.end_date}
					/>
				</Definition>
				<Definition title={__('Status', 'surecart')}>
					<ScOrderStatusBadge status={payout?.status} />
				</Definition>
			</div>

			<ScButton
				href={addQueryArgs('admin.php', {
					page: 'sc-affiliate-payouts',
					action: 'edit',
					id: order?.id,
				})}
				size="small"
			>
				{__('View', 'surecart')}
			</ScButton>
		</ScFlex>;
	};

	const renderEmpty = () => {
		return <div>{__('Not associated to any payout.', 'surecart')}</div>;
	};

	return (
		<Box title="Payout" loading={loading}>
			{referral?.checkout?.id ? renderPayoutDisplay() : renderEmpty()}
		</Box>
	);
};
