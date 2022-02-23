/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';

import { CeInput, CeSwitch, CeSelect } from '@checkout-engine/components-react';
import Box from '../../ui/Box';

export default ({ productGroup, updateProductGroup, loading }) => {
	return (
		<Box title={__('Details', 'checkout_engine')} loading={loading}>
			<div
				css={css`
					display: grid;
					gap: var(--ce-spacing-large);
				`}
			>
				<CeInput
					label={__('Group Name', 'checkout_engine')}
					className="ce-product-name hydrated"
					help={__(
						'A name for your product group.',
						'checkout_engine'
					)}
					value={productGroup?.name}
					onCeChange={(e) => {
						updateProductGroup({ name: e.target.value });
					}}
					name="name"
					required
				/>
			</div>
		</Box>
	);
};
