/** @jsx jsx */
import { css, jsx } from '@emotion/core';

export default ({ title, children }) => {
	return (
		<div
			css={css`
				display: flex;
				align-items: baseline;
				justify-content: space-between;
			`}
		>
			<div
				css={css`
					color: rgb(107, 114, 128);
				`}
			>
				{title}
			</div>
			<div>{children}</div>
		</div>
	);
};
