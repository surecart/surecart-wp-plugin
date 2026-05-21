/** @jsx jsx */
import { css, jsx } from '@emotion/core';

export default ({ src, size = 48 }) =>
	src ? (
		<img
			src={src}
			alt=""
			css={css`
				width: ${size}px;
				height: ${size}px;
				border-radius: 6px;
				object-fit: cover;
				flex-shrink: 0;
			`}
		/>
	) : (
		<div
			aria-hidden="true"
			css={css`
				width: ${size}px;
				height: ${size}px;
				border-radius: 6px;
				background: var(--sc-color-gray-100);
				flex-shrink: 0;
			`}
		/>
	);
