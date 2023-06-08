/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ScFormatNumber, ScTag } from '@surecart/components-react';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

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
				{!shippingRate.max_amount ? (
					<span>&infin;</span>
				) : (
					<ScFormatNumber
						value={shippingRate.max_amount}
						type="currency"
						currency={shippingRate.currency}
					/>
				)}
			</Fragment>
		);
	}

	if (shippingRate.rate_type === 'weight') {
		return (
			<Fragment>
				<ScFormatNumber
					value={shippingRate.min_weight}
					type="unit"
					unit={shippingRate.weight_unit}
					noConvert
				/>{' '}
				-{' '}
				{!shippingRate.max_weight ? (
					<span>&infin;</span>
				) : (
					<ScFormatNumber
						value={shippingRate.max_weight}
						type="unit"
						unit={shippingRate.weight_unit}
						noConvert
					/>
				)}
			</Fragment>
		);
	}
	return (
		<Fragment>
			<ScTag type="primary">{__('Flat Rate', 'surecart')}</ScTag>
		</Fragment>
	);
};
