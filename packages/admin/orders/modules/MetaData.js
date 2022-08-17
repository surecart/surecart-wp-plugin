/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScText } from '@surecart/components-react';

import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';

export default ({ order, loading }) => {
	if (!Object.keys(order?.metadata || {}).length || loading) {
		return null;
	}

	if (order?.metadata?.wp_created_by) {
		delete order.metadata.wp_created_by;
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
						<ScText
							tag="h3"
							style={{
								'--font-weight': 'var(--sc-font-weight-bold)',
								'--font-size': 'var(--sc-font-size-medium)',
							}}
						>
							{key.toUpperCase()}
						</ScText>
						<div>{order?.metadata[key]}</div>
					</div>
				))}
			</div>
		</Box>
	);
};
