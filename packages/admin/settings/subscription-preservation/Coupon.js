/**
 * External dependencies.
 */
import {
	ScInput,
	ScPriceInput,
	ScRadio,
	ScRadioGroup,
} from '@surecart/components-react';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import CouponDiscountDuration from '../../components/coupon/CouponDiscountDuration';

export default ({ coupon, updateCoupon }) => {
	const [type, setType] = useState('percentage');

	useEffect(() => {
		if (coupon?.amount_off) {
			setType('fixed');
		}
	}, [coupon?.amount_off]);

	return (
		<>
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
				>
					<span slot="suffix">%</span>
				</ScInput>
			) : (
				<ScPriceInput
					className="sc-amount-off"
					currencyCode={coupon?.currency}
					disabled={type === 'percentage'}
					attribute="amount_off"
					label={__('Amount Off', 'surecart')}
					value={coupon?.amount_off || null}
					onScInput={(e) => {
						updateCoupon({
							percent_off: null,
							amount_off: parseInt(e.target.value),
						});
					}}
				/>
			)}

			<CouponDiscountDuration
				coupon={coupon}
				updateCoupon={updateCoupon}
			/>

			<ScInput
				label={__('Usage limit per customer', 'surecart')}
				placeholder={__('Unlimited Usage', 'surecart')}
				help={__(
					'The amount of times a single customer use the renewal discount.',
					'surecart'
				)}
				class="max-redemptions-input"
				value={coupon?.max_redemptions_per_customer}
				onScChange={(e) => {
					updateCoupon({
						max_redemptions_per_customer: e.target.value,
					});
				}}
				type="number"
			/>
		</>
	);
};
