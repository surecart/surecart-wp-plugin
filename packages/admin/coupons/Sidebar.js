/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __, sprintf, _n } from '@wordpress/i18n';
import { format } from '@wordpress/date';
import { Fragment } from '@wordpress/element';

import Box from '../ui/Box';
import Definition from '../ui/Definition';

export default ({ coupon, loading }) => {
	const formattedDiscount = () => {
		if (coupon?.percent_off) {
			return sprintf(__('%1s%% off', 'surecart'), coupon?.percent_off);
		}
		if (coupon?.amount_off) {
			return (
				<ce-format-number
					type="currency"
					currency={coupon?.currency}
					value={coupon?.amount_off}
				></ce-format-number>
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
							{format('F j, Y', new Date(coupon.redeem_by))}
						</Definition>
					)}

					{!!coupon?.id && <hr />}

					{!!coupon?.updated_at && (
						<Definition title={__('Last Updated', 'surecart')}>
							{format(
								'F j, Y',
								new Date(coupon.updated_at * 1000)
							)}
						</Definition>
					)}

					{!!coupon?.created_at && (
						<Definition title={__('Created', 'surecart')}>
							{format(
								'F j, Y',
								new Date(coupon.created_at * 1000)
							)}
						</Definition>
					)}
					{!!coupon?.archived_at && (
						<Definition
							css={css`
								margin-bottom: 1em;
							`}
							title={__('Archived On', 'surecart')}
						>
							{format(
								'F j, Y',
								new Date(product?.archived_at * 1000)
							)}
						</Definition>
					)}
				</Fragment>
			</Box>
		</Fragment>
	);
};
