/** @jsx jsx */
import { css, jsx } from '@emotion/core';

export default ({ children }) => {
	return (
		<div
			css={css`
				margin: auto;
				width: 100%;
				max-width: 460px;
				display: flex;
				flex-direction: column;
				gap: var(--sc-spacing-medium);
			`}
		>
			{children}
		</div>
	);
};
