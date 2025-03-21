/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	ScInput,
	ScPriceInput,
	ScRadioGroup,
	ScRadio,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import CouponDiscountDuration from '../../components/coupon/CouponDiscountDuration';

export default ({ coupon, loading, updateCoupon }) => {
	const [type, setType] = useState('percentage');

	useEffect(() => {
		if (coupon?.amount_off) {
			setType('fixed');
		}
	}, [coupon?.amount_off]);

	return (
		<Box title={__('Amount', 'surecart')} loading={loading}>
			<div
				css={css`
					display: grid;
					gap: var(--sc-form-row-spacing-large);
				`}
			>
				<ScRadioGroup
					label={__('Choose a type', 'surecart')}
					onScChange={(e) => setType(e.target.value)}
				>
					<ScRadio value="percentage" checked={type === 'percentage'}>
						{__('Percentage Discount', 'surecart')}
					</ScRadio>
					<ScRadio value="fixed" checked={type === 'fixed'}>
						{__('Fixed Discount', 'surecart')}
					</ScRadio>
				</ScRadioGroup>

				{type === 'percentage' ? (
					<ScInput
						className="sc-percent-off"
						type="number"
						disabled={type !== 'percentage'}
						min="0"
						max="100"
						step="0.01"
						attribute="percent_off"
						label={__('Percent Off', 'surecart')}
						value={coupon?.percent_off || null}
						onScInput={(e) =>
							updateCoupon({
								amount_off: null,
								percent_off: e.target.value,
							})
						}
						required={type === 'percentage'}
					>
						<span slot="suffix">%</span>
					</ScInput>
				) : (
					<ScPriceInput
						className="sc-amount-off"
						currencyCode={coupon?.currency || scData?.currency_code}
						disabled={type === 'percentage'}
						attribute="amount_off"
						label={__('Amount Off', 'surecart')}
						value={coupon?.amount_off || null}
						required={type === 'fixed'}
						onScInput={(e) => {
							updateCoupon({
								percent_off: null,
								amount_off: e.target.value,
							});
						}}
					/>
				)}

				<CouponDiscountDuration
					coupon={coupon}
					updateCoupon={updateCoupon}
				/>
			</div>
		</Box>
	);
};
