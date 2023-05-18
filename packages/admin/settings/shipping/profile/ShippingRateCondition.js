/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ScFormatNumber } from '@surecart/components-react';
import { Fragment } from '@wordpress/element';

export default ({ shippingRate }) => {
	if (shippingRate.rate_type === 'amount') {
		return (
			<Fragment>
				<ScFormatNumber
					value={shippingRate.min_amount}
					type="currency"
					currency={shippingRate.currency}
				/>{' '}
				-{' '}
				<ScFormatNumber
					value={shippingRate.max_amount}
					type="currency"
					currency={shippingRate.currency}
				/>
			</Fragment>
		);
	}

	return (
		<Fragment>
			<ScFormatNumber
				value={shippingRate.min_weight}
				type="unit"
				unit={shippingRate.weight_unit}
				noConvert
			/>{' '}
			-{' '}
			<ScFormatNumber
				value={shippingRate.max_weight}
				type="unit"
				unit={shippingRate.weight_unit}
				noConvert
			/>
		</Fragment>
	);
};
