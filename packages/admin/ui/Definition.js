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
				min-width: 0;
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
					min-width: 0;
					overflow-wrap: break-word;
				`}
			>
				{children}
			</div>
		</div>
	);
};
