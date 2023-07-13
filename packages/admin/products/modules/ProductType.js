/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

export default ({ variantsEnabled, setVariantsEnabled }) => {
	return (
		<div css={css`display: flex gap: var(--sc-spacing-small);`}>
			<label
				css={css`
					font-family: var(--sc-font-sans);
					font-size: var(--sc-font-size-medium);
					font-weight: var(--sc-font-weight-normal);
					gap: var(--sc-input-label-margin);
					display: inline-block;
					color: var(--sc-input-label-color);
					font-weight: var(--sc-input-label-font-weight);
					text-transform: var(--sc-input-label-text-transform, none);
					letter-spacing: var(--sc-input-label-letter-spacing, 0);
					margin-bottom: var(--sc-input-label-margin-bottom, 0.5rem);
				`}
			>
				{__('Product type', 'surecart')}
			</label>

			<div
				css={css`
					display: flex;
					gap: var(--sc-spacing-small);
				`}
			>
				<div
					onClick={() => {
						setVariantsEnabled(false);
					}}
					css={css`
						border: 2px solid
							${!variantsEnabled
								? 'var(--sc-color-info-500)'
								: '#eee'};
						flex: 1;
						border-radius: 4px;
						padding: 0.8rem 1rem;
						cursor: pointer;
						color: var(--sc-input-label-color);
						font-family: var(--sc-font-sans);
						font-size: var(--sc-font-size-medium);
						font-weight: var(--sc-font-weight-normal);
						transition: border-color 0.2s ease-in-out;
						:hover {
							border: 2px solid
								${!variantsEnabled
									? 'var(--sc-color-info-500)'
									: '#eee'};
						}
					`}
				>
					<label
						css={css`
							color: var(--sc-color-black);
							font-size: var(--sc-font-size-large);
							display: block;
							margin-bottom: 1rem;
						`}
					>
						{__('Price options', 'surecart')}
					</label>
					<span
						css={css`
							color: var(--sc-input-label-color);
							font-size: var(--sc-font-size-medium);
						`}
					>
						{__(
							'Add optional multiple one item, subscription and installment price choices.',
							'surecart'
						)}
					</span>
				</div>
				<div
					onClick={() => {
						setVariantsEnabled(true);
					}}
					css={css`
						border: 2px solid
							${variantsEnabled
								? 'var(--sc-color-info-500)'
								: '#eee'};
						flex: 1;
						border-radius: 4px;
						padding: 0.8rem 1rem;
						cursor: pointer;
						color: var(--sc-input-label-color);
						font-family: var(--sc-font-sans);
						font-size: var(--sc-font-size-medium);
						font-weight: var(--sc-font-weight-normal);
						transition: border-color 0.2s ease-in-out;
						:hover {
							border: 2px solid
								${variantsEnabled
									? 'var(--sc-color-info-500)'
									: '#eee'};
						}
					`}
				>
					<label
						css={css`
							color: var(--sc-color-black);
							font-size: var(--sc-font-size-large);
							display: block;
							margin-bottom: 1rem;
						`}
					>
						{__('Variation options', 'surecart')}
					</label>
					<span
						css={css`
							color: var(--sc-input-label-color);
							font-size: var(--sc-font-size-medium);
						`}
					>
						{__(
							'Add variation option choices like size and color.',
							'surecart'
						)}
					</span>
				</div>
			</div>
		</div>
	);
};
