/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScInput, ScTextarea } from '@surecart/components-react';
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
				<ScTextarea
					label={__('Description', 'surecart')}
					help={__(
						'The product’s description, meant to be displayable to the customer.',
						'surecart'
					)}
					value={product?.description}
					onScInput={(e) => {
						updateProduct({ description: e.target.value });
					}}
					name="description"
				/>
			</div>
		</Box>
	);
};
