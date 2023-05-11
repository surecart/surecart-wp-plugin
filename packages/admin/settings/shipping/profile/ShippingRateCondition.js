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
				value={shippingRate.min_amount}
				type="unit"
				unit={shippingRate.weight_unit}
			/>{' '}
			-{' '}
			<ScFormatNumber
				value={shippingRate.min_amount}
				type="unit"
				unit={shippingRate.weight_unit}
			/>
		</Fragment>
	);

	return `${shippingRate.min_amount}${shippingRate.weight_unit} - ${shippingRate.max_amount}${shippingRate.weight_unit}`;
};
