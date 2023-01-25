/** @jsx jsx */
import { css, jsx } from '@emotion/core';

export default function save({ attributes }) {
	const { text } = attributes;

	return (
		<h4
			css={css`
				margin-top: 0.8rem;
				font-size: 1.2rem;
				margin: 0;
			`}
		>
			{text}
		</h4>
	);
}
