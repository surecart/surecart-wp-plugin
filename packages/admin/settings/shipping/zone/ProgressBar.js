/** @jsx jsx */
import { jsx, css } from '@emotion/core';

export default ({ title, isFilled }) => {
	return (
		<div
			css={css`
				width: 100%;
				color: ${isFilled
					? 'var(--sc-color-primary-500)'
					: 'var(--sc-color-gray-300)'};
			`}
		>
			<span>{title}</span>
			<div
				css={css`
					width: 100%;
					height: 4px;
					margin-top: var(--sc-spacing-small);
					background-color: ${isFilled
						? 'var(--sc-color-primary-500)'
						: 'var(--sc-color-gray-300)'};
				`}
			></div>
		</div>
	);
};
