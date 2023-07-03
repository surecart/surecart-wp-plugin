/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScInput, ScRichText } from '@surecart/components-react';
import Box from '../../ui/Box';

export default ({ id, productCollection, updateProductCollection, loading }) => {
	return (
		<Box
			title={
				id
					? __('Details', 'surecart')
					: __('Edit Collection', 'surecart')
			}
			loading={loading}
		>
			<div
				css={css`
					display: grid;
					gap: var(--sc-spacing-large);
				`}
			>
				<ScInput
					label={__('Name', 'surecart')}
					className="sc-collection-name hydrated"
					help={__(
						'A name for your product collection.',
						'surecart'
					)}
					value={productCollection?.name}
					onScInput={(e) => {
						updateProductCollection({ name: e.target.value });
					}}
					name="name"
					required
				/>
				<ScRichText
					label={__('Description', 'surecart')}
					placeholder={__('Enter a description...', 'surecart')}
					help={__(
						'A short description for your product collection.',
						'surecart'
					)}
					style={{ '--sc-rich-text-max-height': '200px' }}
					maxlength={2500}
					onScInput={(e) => {
						updateProductCollection({ description: e.target.value });
					}}
					value={productCollection?.description}
					name="description"
				/>
			</div>
		</Box>
	);
};
