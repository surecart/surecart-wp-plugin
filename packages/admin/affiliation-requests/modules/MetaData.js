/** @jsx jsx */
import Box from '../../ui/Box';
import { css, jsx } from '@emotion/core';
import { ScText } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default ({ affiliationRequest, loading }) => {
	return (
		<Box title={__('Additional Data', 'surecart')} loading={loading}>
			<div
				css={css`
					display: grid;
					gap: 0.5em;
				`}
			>
				{Object.keys(affiliationRequest?.metadata).map((key) => (
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
						<div>{`${affiliationRequest?.metadata[key]}`}</div>
					</div>
				))}
			</div>
		</Box>
	);
};
