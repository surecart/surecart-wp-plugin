/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Placeholder } from '@wordpress/components';
import { button as icon } from '@wordpress/icons';

/**
 * Component Dependencies
 */
import PriceSelector from '@scripts/blocks/components/PriceSelector';
import { ScButton } from '@surecart/components-react';

export default ({ setAttributes, selectedPriceId }) => {
	return (
		<Placeholder icon={icon} label={__('Select a product', 'surecart')}>
			<div>
				<div
					css={css`
						color: var(--sc-color-gray-500);
						margin-bottom: 1em;
					`}
				>
					{__(
						'To add a product for the cart button, click the "Select Product" button.',
						'surecart'
					)}
				</div>
				<PriceSelector
					onSelect={({ price_id, variant_id }) => {
						setAttributes({ price_id, variant_id });
					}}
					value={selectedPriceId}
					requestQuery={{
						archived: false,
					}}
					allowOutOfStockSelection={true}
				>
					<ScButton slot="trigger">
						{__('Select Product', 'surecart')}
					</ScButton>
				</PriceSelector>
			</div>
		</Placeholder>
	);
};
