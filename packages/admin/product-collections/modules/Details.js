/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScInput, ScRichText } from '@surecart/components-react';
import Box from '../../ui/Box';

export default ({ id, collection, updateCollection, loading }) => {
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
					help={__('A name for your product collection.', 'surecart')}
					value={collection?.name}
					onScInput={(e) => {
						updateCollection({ name: e.target.value });
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
						updateCollection({ description: e.target.value });
					}}
					value={collection?.description}
					name="description"
				/>
			</div>
		</Box>
	);
};
