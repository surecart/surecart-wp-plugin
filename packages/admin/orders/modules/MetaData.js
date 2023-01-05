/** @jsx jsx */
import Box from '../../ui/Box';
import { css, jsx } from '@emotion/core';
import { ScText } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default ({ order, loading }) => {
	if (!Object.keys(order?.checkout?.metadata || {}).length || loading) {
		return null;
	}

	const { wp_created_by, page_id, page_url, ...metadata } =
		order?.checkout?.metadata || {};

	return (
		<Box title={__('Metadata', 'surecart')}>
			<div
				css={css`
					display: grid;
					gap: 0.5em;
				`}
			>
				{Object.keys(metadata).map((key) => (
					<div>
						<ScText
							tag="h3"
							style={{
								'--font-weight': 'var(--sc-font-weight-bold)',
								'--font-size': 'var(--sc-font-size-medium)',
							}}
						>
							{key.replaceAll('_', ' ')}
						</ScText>
						<div>{metadata[key]}</div>
					</div>
				))}
			</div>
		</Box>
	);
};
