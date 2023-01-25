/** @jsx jsx */
import { css, jsx } from '@emotion/core';

export default function save({ attributes }) {
	const { amount, scratchAmount } = attributes;

	return (
		<div
			css={css`
				display: flex;
				align-items: center;
				gap: 1rem;
				font-size: 0.88rem;
				margin-top: 0.8rem;
			`}
		>
			<strong>{amount}</strong>
			<span>{scratchAmount}</span>
		</div>
	);
}
