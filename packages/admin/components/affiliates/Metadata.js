/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { ScText } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';

export default ({ metadata, title, loading }) => {
	// Return null if no metadata.
	if (!metadata || !Object.keys(metadata).length) {
		return null;
	}

	return (
		<Box
			title={title || __('Additional Data', 'surecart')}
			loading={loading}
		>
			<div
				css={css`
					display: grid;
					gap: 0.5em;
					min-width: 0;
				`}
			>
				{Object.keys(metadata).map((key) => (
					<div
						key={key}
						css={css`
							min-width: 0;
						`}
					>
						<ScText
							tag="h3"
							style={{
								'--font-weight': 'var(--sc-font-weight-bold)',
								'--font-size': 'var(--sc-font-size-medium)',
							}}
						>
							{key.replaceAll('_', ' ')}
						</ScText>

						<div
							css={css`
								overflow-wrap: break-word;
							`}
						>
							{metadata[key]}
						</div>
					</div>
				))}
			</div>
		</Box>
	);
};
