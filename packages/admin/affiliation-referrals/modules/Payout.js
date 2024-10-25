/** @jsx jsx */
/**
 * External Dependencies
 */
import { jsx } from '@emotion/core';

/**
 * Internal dependencies
 */
import { ScButton, ScFormatNumber, ScTag } from '@surecart/components-react';
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
		return (
			<>
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
					<ScTag
						type={
							'completed' === payout?.status
								? 'success'
								: 'warning'
						}
					>
						{payout?.status_display_text}
					</ScTag>
				</Definition>
			</>
		);
	};

	const renderEmpty = () => {
		return <div>{__('Not associated to any payout.', 'surecart')}</div>;
	};

	return (
		<Box
			title={__('Payout', 'surecart')}
			loading={loading || loadingPayout}
			footer={
				!!payout?.id && (
					<ScButton
						href={addQueryArgs('admin.php', {
							page: 'sc-affiliate-payouts',
							action: 'edit',
							id: payout?.id,
						})}
					>
						{__('View Payout', 'surecart')}
					</ScButton>
				)
			}
		>
			{payout ? renderPayoutDisplay() : renderEmpty()}
		</Box>
	);
};
