/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScIcon } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default ({ productMedia, onDeleteImage }) => {
	return (
		<div
			css={css`
				background: #f3f3f3;
				cursor: move;
				position: relative;

				.overlay,
				.delete-icon {
					display: none;
				}

				:hover .overlay,
				:hover .delete-icon {
					display: block;
				}
			`}
			media-id={productMedia.id}
		>
			<ScIcon
				className="delete-icon"
				onClick={() => onDeleteImage(productMedia)}
				css={css`
					position: absolute;
					top: 2px;
					right: 2px;
					z-index: 10;
					cursor: pointer;
					padding: var(--sc-spacing-xxx-small);
					border-radius: var(--sc-border-radius-small);
					color: var(--sc-color-white);
					font-weight: var(--sc-font-weight-semibold);
					background-color: var(--sc-color-gray-800);
				`}
				name="x"
			/>
			<div
				className="overlay"
				css={css`
					background-color: var(--sc-overlay-background-color);
					position: absolute;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					z-index: 2;
				`}
			></div>
			<img
				src={productMedia?.media?.url}
				alt="product image"
				css={css`
					max-width: 100%;
					width: 380px;
					aspect-ratio: 1/1;
					object-fit: cover;
					height: auto;
					display: block;
					border-radius: var(--sc-border-radius-medium);
				`}
			/>
		</div>
	);
};
