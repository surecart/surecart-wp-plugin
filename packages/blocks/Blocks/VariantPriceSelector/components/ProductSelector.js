/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScButton, ScSelect } from '@surecart/components-react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Placeholder, Spinner } from '@wordpress/components';

export default ({ onSelectProduct, productChoices, loadingProducts }) => {
	if (loadingProducts) {
		return (
			<Placeholder>
				<Spinner />
			</Placeholder>
		);
	}

	return (
		<Placeholder
			label={__('Select a product', 'surecart')}
			instructions={__(
				'Please pick a product with available variants to use the Variant Price Selector.',
				'surecart'
			)}
		>
			<>
				<div
					css={css`
						width: 100%;
						display: flex;
						margin-bottom: var(--sc-spacing-medium);
					`}
				>
					<ScSelect
						placeholder={__('Choose product', 'surecart')}
						search
						choices={productChoices}
						css={css`
							width: 100%;
						`}
						onScChange={(e) => {
							onSelectProduct(e.target.value);
						}}
					>
						<ScButton
							type="default"
							css={css`
								width: auto;
							`}
							slot="trigger"
						>
							{__('Select Product', 'surecart')}
						</ScButton>
					</ScSelect>
				</div>
			</>
		</Placeholder>
	);
};
