/** @jsx jsx */
/**
 * External Dependencies
 */
import { jsx } from '@emotion/core';

/**
 * Internal dependencies
 */
import {
	ScButton,
	ScFlex,
	ScFormatNumber,
	ScOrderStatusBadge,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import Definition from '../../ui/Definition';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

export default ({ referral, loading }) => {
	const { payout, loadingPayout } = useSelect((select) => {
		if (!referral?.payout) {
			return {};
		}

		const queryArgs = ['surecart', 'payout', referral?.payout];

		return {
			payout: select(coreStore).getEntityRecord(...queryArgs),
			loadingPayout: select(coreStore).isResolving(
				'getEntityRecord',
				queryArgs
			),
		};
	});

	const renderPayoutDisplay = () => {
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
					{payout?.end_at_date}
				</Definition>
				<Definition title={__('Status', 'surecart')}>
					<ScOrderStatusBadge status={payout?.status} />
				</Definition>
			</div>

			<ScButton
				href={addQueryArgs('admin.php', {
					page: 'sc-affiliate-payouts',
					action: 'edit',
					id: payout?.id,
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
		<Box
			title={__('Payout', 'surecart')}
			loading={loading || loadingPayout}
		>
			{referral?.payout?.id ? renderPayoutDisplay() : renderEmpty()}
		</Box>
	);
};
