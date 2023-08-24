/** @jsx jsx */
import { jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import { ScPriceInput } from '@surecart/components-react';

export default ({ coupon, updateCoupon, loading }) => {
	return (
		<Box title={__('Checkout Requirement', 'surecart')} loading={loading}>
			<ScPriceInput
				className="sc-coupon-minimum-subtotal-amount"
				help={__(
					'The minimum order subtotal amount required to apply this coupon.',
					'surecart'
				)}
				currencyCode={coupon?.currency}
				attribute="min_subtotal_amount"
				label={__('Minimum Order Subtotal', 'surecart')}
				value={coupon?.min_subtotal_amount || null}
				onScInput={(e) =>
					updateCoupon({ min_subtotal_amount: e.target.value })
				}
			/>
		</Box>
	);
};
