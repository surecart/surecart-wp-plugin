/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';

import { ScInput, ScSwitch, ScSelect } from '@surecart/components-react';
import Box from '../../ui/Box';

export default ({ id, productGroup, updateProductGroup, loading }) => {
	return (
		<Box
			title={
				id
					? __('Details', 'surecart')
					: __('New Upgrade Group', 'surecart')
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
					label={__('Group Name', 'surecart')}
					className="sc-product-name hydrated"
					help={__('A name for your product group.', 'surecart')}
					value={productGroup?.name}
					onScInput={(e) => {
						updateProductGroup({ name: e.target.value });
					}}
					name="name"
					required
				/>
			</div>
		</Box>
	);
};
