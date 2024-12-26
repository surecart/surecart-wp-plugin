/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __, sprintf, _n } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

import Box from '../ui/Box';
import Definition from '../ui/Definition';
import { formatDateTime } from '../util/time';

export default ({ coupon, loading }) => {
	const formattedDiscount = () => {
		if (coupon?.percent_off) {
			return sprintf(__('%s%% off', 'surecart'), coupon?.percent_off);
		}
		if (coupon?.amount_off) {
			return (
				<sc-format-number
					type="currency"
					currency={coupon?.currency}
					value={coupon?.amount_off}
				></sc-format-number>
			);
		}
	};

	const renderDuration = () => {
		if (coupon?.duration === 'once') {
			return __('Once', 'surecart');
		}
		if (coupon?.duration === 'repeating' && coupon?.duration_in_months) {
			return sprintf(
				__('%d months', 'surecart'),
				coupon?.duration_in_months
			);
		}
		return __('Forever', 'surecart');
	};

	return (
		<Fragment>
			<Box
				loading={loading}
				title={
					<div
						css={css`
							display: flex;
							align-items: center;
							justify-content: space-between;
						`}
					>
						{__('Summary', 'surecart')}
					</div>
				}
				css={css`
					font-size: 14px;
				`}
			>
				<Fragment>
					{formattedDiscount() && (
						<Definition title={__('Discount', 'surecart')}>
							{formattedDiscount()}
						</Definition>
					)}

					<Definition title={__('Uses', 'surecart')}>
						{coupon?.times_redeemed || 0} /{' '}
						{!!coupon?.max_redemptions ? (
							coupon?.max_redemptions
						) : (
							<span>&infin;</span>
						)}
					</Definition>

					<Definition title={__('Duration', 'surecart')}>
						{renderDuration()}
					</Definition>

					{!!coupon?.redeem_by && (
						<Definition title={__('Redeem By', 'surecart')}>
							{formatDateTime(coupon.redeem_by * 1000)}
						</Definition>
					)}

					{!!coupon?.id && <hr />}

					{!!coupon?.updated_at && (
						<Definition title={__('Last Updated', 'surecart')}>
							{coupon.updated_at_date_time}
						</Definition>
					)}

					{!!coupon?.created_at && (
						<Definition title={__('Created', 'surecart')}>
							{coupon.created_at_date_time}
						</Definition>
					)}
					{!!coupon?.archived_at && (
						<Definition
							css={css`
								margin-bottom: 1em;
							`}
							title={__('Archived On', 'surecart')}
						>
							{coupon?.archived_at_date_time}
						</Definition>
					)}
				</Fragment>
			</Box>
		</Fragment>
	);
};
