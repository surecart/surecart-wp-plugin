/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';

export default ({ order, loading }) => {
	if (!Object.keys(order?.metadata || {}).length || loading) {
		return null;
	}

	return (
		<Box title={__('Metadata', 'surecart')}>
			<div
				css={css`
					display: grid;
					gap: 0.5em;
				`}
			>
				{Object.keys(order?.metadata).map((key) => (
					<div>
						<ce-text
							tag="h3"
							style={{
								'--font-weight': 'var(--ce-font-weight-bold)',
								'--font-size': 'var(--ce-font-size-medium)',
							}}
						>
							{key.toUpperCase()}
						</ce-text>
						<div>{order?.metadata[key]}</div>
					</div>
				))}
			</div>
		</Box>
	);
};
