/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScButton, ScIcon } from '@surecart/components-react';

import ModelSelector from '../../../components/ModelSelector';

export default ({ excludeIds, onSelect, disabled }) => {
	return (
		<div
			css={css`
				width: 22rem;
			`}
		>
			<ModelSelector
				kind="surecart"
				name="product"
				requestQuery={{ bundle: false }}
				exclude={excludeIds}
				onSelect={onSelect}
				searchPlaceholder={__('Search for a product…', 'surecart')}
			>
				<ScButton slot="trigger" disabled={disabled}>
					<ScIcon name="plus" slot="prefix" />
					{__('Add Product', 'surecart')}
				</ScButton>
			</ModelSelector>
		</div>
	);
};
