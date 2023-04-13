/** @jsx jsx */
import { css, jsx } from '@emotion/core';

export default ({ imageNode, title, label }) => {
	return (
		<div
			css={css`
				text-align: center;
			`}
		>
			{imageNode}
			<h2
				css={css`
					font-size: 28px;
					margin: 20px 0;
				`}
			>
				{title}
			</h2>
			<p
				css={css`
					font-size: 18px;
					margin: 20px 0;
					color: var(--sc-color-gray-500);
				`}
			>
				{label}
			</p>
		</div>
	);
};
