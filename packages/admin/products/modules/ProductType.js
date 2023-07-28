/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScFlex, ScFormControl } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default ({ variantsEnabled, setVariantsEnabled }) => {
	const renderProductType = (isVariant = false) => {
		return (
			<div
				onClick={() => {
					setVariantsEnabled(isVariant);
				}}
				css={css`
					border: 2px solid
						${isVariant && variantsEnabled
							? 'var(--sc-color-info-500)'
							: !isVariant && !variantsEnabled
							? 'var(--sc-color-info-500)'
							: '#eee'};
					flex: 1;
					border-radius: 4px;
					padding: 1rem 3rem 1rem 1rem;
					cursor: pointer;
					color: var(--sc-input-label-color);
					transition: border-color 0.2s ease-in-out;
				`}
			>
				<ScFormControl
					css={css`
						display: block;
						margin-bottom: 1rem;
					`}
				>
					{isVariant
						? __('Variation options', 'surecart')
						: __('Price options', 'surecart')}
				</ScFormControl>

				<span
					css={css`
						color: rgb(107, 114, 128);
						font-size: var(--sc-font-size-medium);
					`}
				>
					{isVariant
						? __(
								'Add variation option choices like size and color.',
								'surecart'
						  )
						: __(
								'Add optional multiple one item, subscription and installment price choices.',
								'surecart'
						  )}
				</span>
			</div>
		);
	};

	return (
		<div>
			<label
				css={css`
					font-family: var(--sc-font-sans);
					font-size: var(--sc-font-size-medium);
					font-weight: var(--sc-font-weight-normal);
					display: inline-block;
					color: var(--sc-input-label-color);
					font-weight: var(--sc-input-label-font-weight);
					text-transform: var(--sc-input-label-text-transform, none);
					letter-spacing: var(--sc-input-label-letter-spacing, 0);
					margin-bottom: var(--sc-input-label-margin-bottom, 0.5rem);
				`}
			>
				{__('Product type', 'surecart')}
				<span style={{ color: 'red' }}> *</span>
			</label>

			<ScFlex style={{ gap: '2rem' }}>
				{renderProductType(false)}
				{renderProductType(true)}
			</ScFlex>
		</div>
	);
};
