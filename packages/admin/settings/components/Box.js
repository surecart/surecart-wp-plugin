/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScCard } from '@surecart/components-react';

export default ({ title, description, children }) => {
	return (
		<div
			css={css`
				max-width: 768px;
				margin: auto;
			`}
		>
			{title && (
				<h4
					css={css`
						margin: 0 0 0.35em 0;
					`}
				>
					{title}
				</h4>
			)}
			{description && (
				<p
					css={css`
						margin: 0 0 0.75em 0;
					`}
				>
					{description}
				</p>
			)}
			<ScCard>{children}</ScCard>
		</div>
	);
};
