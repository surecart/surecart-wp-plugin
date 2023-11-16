/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Placeholder } from '@wordpress/components';
import { button as icon } from '@wordpress/icons';
import { useEffect, useState } from '@wordpress/element';

/**
 * Component Dependencies
 */
import PriceSelector from '@scripts/blocks/components/PriceSelector';
import { ScButton } from '@surecart/components-react';

export default ({ setAttributes, selectedPriceId, setShowChangePrice }) => {
	const [showPriceSelector, setShowPriceSelector] = useState(false);

	useEffect(() => {
		if (!!selectedPriceId) {
			setShowPriceSelector(true);
		}
	}, []);

	return (
		<Placeholder icon={icon} label={__('Select a price', 'surecart')}>
			{showPriceSelector ? (
				<div
					css={css`
						width: inherit;
					`}
				>
					<PriceSelector
						onSelect={({ price_id }) => {
							setAttributes({ price_id });
							setShowPriceSelector(false);
							setShowChangePrice(false);
						}}
						value={selectedPriceId}
					/>
					{selectedPriceId && (
						<ScButton
							onClick={() => {
								setShowPriceSelector(false);
								setShowChangePrice(false);
							}}
							css={css`
								margin-top: var(--sc-spacing-small);
							`}
						>
							{__('Cancel', 'surecart')}
						</ScButton>
					)}
				</div>
			) : (
				<div>
					<div
						css={css`
							color: var(--sc-color-gray-500);
						`}
					>
						{__(
							'To add a product for the cart button, click the "Select Product" button.',
							'surecart'
						)}
					</div>

					<ScButton onClick={() => setShowPriceSelector(true)}>
						{__('Select Product', 'surecart')}
					</ScButton>
				</div>
			)}
		</Placeholder>
	);
};
