/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import ProductLineItem from '../../ui/ProductLineItem';

export default ({ product, loading }) => {
	if (!product || loading) {
		return null;
	}

	const price = product?.active_prices ? product?.active_prices[0] : null;

	return (
		<Box title={__('Product', 'surecart')}>
			<ProductLineItem
				key={product?.id}
				lineItem={{
					price: {
						...price,
						product,
					},
					// variant,
					// variant_options: [
					// 	variant?.option_1,
					// 	variant?.option_2,
					// 	variant?.option_3,
					// ],
				}}
			></ProductLineItem>
		</Box>
	);
};
