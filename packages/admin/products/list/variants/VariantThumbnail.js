/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ScIcon } from '@surecart/components-react';

const Placeholder = ({ size }) => (
	<div
		css={css`
			width: ${size}px;
			height: ${size}px;
			flex: 0 0 ${size}px;
			display: flex;
			align-items: center;
			justify-content: center;
			background: var(--sc-color-gray-100);
			border: var(--sc-input-border);
			border-radius: var(--sc-border-radius-medium);
			box-shadow: var(--sc-shadow-small);
		`}
	>
		<ScIcon
			name="image"
			style={{
				color: 'var(--sc-color-gray-400)',
				width: '14px',
				height: '14px',
			}}
		/>
	</div>
);

export default function VariantThumbnail({ variant, size = 40 }) {
	const src = variant?.line_item_image?.src || variant?.image_url || '';
	if (!src) return <Placeholder size={size} />;

	const alt = [variant?.option_1, variant?.option_2, variant?.option_3]
		.filter(Boolean)
		.join(' / ');

	return (
		<img
			src={src}
			alt={alt}
			css={css`
				width: ${size}px;
				height: ${size}px;
				flex: 0 0 ${size}px;
				object-fit: cover;
				border: var(--sc-input-border);
				border-radius: var(--sc-border-radius-medium);
				box-shadow: var(--sc-shadow-small);
			`}
		/>
	);
}
