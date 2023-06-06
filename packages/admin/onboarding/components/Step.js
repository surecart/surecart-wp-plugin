/** @jsx jsx */
import { css, jsx } from '@emotion/core';

export default ({
	imageNode,
	title,
	label,
	children,
	width = '460px',
	textAlign = 'center',
}) => {
	return (
		<div
			css={css`
				display: grid;
				align-items: ${textAlign};
				gap: var(--sc-spacing-x-large);
				width: 100%;
				max-width: ${width};
				margin: auto;
			`}
		>
			{!!imageNode && (
				<div
					css={css`
						text-align: ${textAlign};
					`}
				>
					{imageNode}
				</div>
			)}
			{!!title && (
				<h2
					css={css`
						text-align: ${textAlign};
						font-size: 28px;
						line-height: 1;
						margin: 0;
						@media (max-width: 768px) {
							font-size: 24px;
						}
					`}
				>
					{title}
				</h2>
			)}
			{label && (
				<p
					css={css`
						text-align: ${textAlign};
						font-size: 18px;
						margin: 0;
						color: var(--sc-color-gray-500);
						line-height: var(--sc-line-height-dense);
						@media (max-width: 768px) {
							font-size: 16px;
						}
					`}
				>
					{label}
				</p>
			)}
			{children}
		</div>
	);
};
