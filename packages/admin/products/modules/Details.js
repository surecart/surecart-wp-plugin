/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScInput, ScRichText } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';

export default ({ product, updateProduct, loading }) => {
	return (
		<Box title={__('Details', 'surecart')} loading={loading}>
			<div
				css={css`
					display: grid;
					gap: var(--sc-spacing-large);
				`}
			>
				<ScInput
					label={__('Name', 'surecart')}
					className="sc-product-name hydrated"
					help={__('A name for your product.', 'surecart')}
					value={product?.name}
					onScInput={(e) => {
						updateProduct({ name: e.target.value });
					}}
					name="name"
					required
				/>
				<ScRichText
					label={__('Description', 'surecart')}
					placeholder={__('Enter a description...', 'surecart')}
					help={__(
						'A short description for your product that is displayed on product and instant checkouts.',
						'surecart'
					)}
					maxlength={2500}
					value={product?.description}
					onScInput={(e) => {
						updateProduct({ description: e.target.value });
					}}
				/>
			</div>
		</Box>
	);
};
