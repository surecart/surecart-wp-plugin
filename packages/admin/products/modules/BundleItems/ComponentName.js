/** @jsx jsx */
import { css, jsx } from '@emotion/core';

export default ({ name, link }) =>
	link ? (
		<a
			href={link}
			target="_blank"
			rel="noopener noreferrer"
			css={css`
				font-weight: 500;
				text-decoration: none;
				&:hover {
					text-decoration: underline;
				}
			`}
		>
			{name}
		</a>
	) : (
		<div
			css={css`
				font-weight: 500;
				color: var(--sc-color-gray-700);
			`}
		>
			{name}
		</div>
	);
