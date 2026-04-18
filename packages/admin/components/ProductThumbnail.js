/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * ProductThumbnail — 40x40 product image with a fallback placeholder.
 *
 * @param {Object} props
 * @param {Object} props.product Product record with optional line_item_image.
 * @param {number} [props.size] Size in px, default 40.
 */
export default function ProductThumbnail({ product, size = 40 }) {
	const image = product?.line_item_image;
	const hasImage = image?.src && image?.type !== 'fallback';

	const frameStyles = css`
		width: ${size}px;
		height: ${size}px;
		flex: 0 0 ${size}px;
		border: var(--sc-input-border);
		border-radius: var(--sc-border-radius-medium);
		box-shadow: var(--sc-shadow-small);
	`;

	if (hasImage) {
		return (
			<img
				src={image.src}
				alt={product?.name || ''}
				css={css`
					${frameStyles};
					object-fit: cover;
				`}
			/>
		);
	}

	return (
		<div
			css={css`
				${frameStyles};
				background: #f3f3f3;
				display: flex;
				align-items: center;
				justify-content: center;
			`}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				style={{ width: '18px', height: '18px' }}
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
				/>
			</svg>
		</div>
	);
}
