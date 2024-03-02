/** @jsx jsx */
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import { css, jsx } from '@emotion/core';

export default ({ affiliation, updateAffiliation, loading }) => {
	return (
		<Box title={__('Clicks', 'surecart')} loading={loading}>
			<div
				css={css`
					display: grid;
					gap: var(--sc-form-row-spacing);
				`}
			>
				{/* Click Data */}
			</div>
		</Box>
	);
};
