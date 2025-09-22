/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import ProductLineItem from '../../ui/ProductLineItem';

export default ({ review, loading }) => {
	const product = review?.product || null;
	const price = product?.active_prices ? product?.active_prices[0] : null;

	return (
		<Box title={__('Product', 'surecart')} loading={loading}>
			{product?.id && price && (
				<a
					href={addQueryArgs('admin.php', {
						page: 'sc-products',
						action: 'edit',
						id: product?.id,
					})}
					css={css`
						text-decoration: none;
						color: inherit;
					`}
				>
					<ProductLineItem
						key={product?.id}
						lineItem={{
							price: {
								...price,
								product,
							},
						}}
					></ProductLineItem>
				</a>
			)}
		</Box>
	);
};
