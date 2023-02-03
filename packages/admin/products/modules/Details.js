/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScInput, ScTextarea, ScRichText } from '@surecart/components-react';
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
					help={__(
						'The product’s description, typically displayed on the product page.',
						'surecart'
					)}
					value={product?.description}
					onScInput={(e) => {
						updateProduct({ description: e.target.value });
					}}
				/>
			</div>
		</Box>
	);
};
