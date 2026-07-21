/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ScIcon } from '@surecart/components-react';

export default function ProductThumbnail({ product, size = 40 }) {
	const image = product?.line_item_image;
	const hasImage = image?.src && image?.type !== 'fallback';

	if (hasImage) {
		return (
			<img
				src={image.src}
				alt={product?.name || ''}
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

	return (
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
					width: '18px',
					height: '18px',
				}}
			/>
		</div>
	);
}
