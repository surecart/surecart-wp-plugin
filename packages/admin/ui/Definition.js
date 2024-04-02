/** @jsx jsx */
import { css, jsx } from '@emotion/core';

export default ({ title, children, className }) => {
	return (
		<div
			className={className}
			css={css`
				display: flex;
				align-items: baseline;
				justify-content: space-between;
				gap: 1em;
			`}
		>
			<div
				css={css`
					color: rgb(107, 114, 128);
				`}
			>
				{title}
			</div>
			<div
				css={css`
					text-align: right;
				`}
			>
				{children}
			</div>
		</div>
	);
};
