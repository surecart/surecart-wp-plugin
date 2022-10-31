import { css, jsx } from '@emotion/core';

/** @jsx jsx */
import Box from '../ui/Box';

export default ({ title, loading, description, children, compare }) => {
	return (
		<Box
			title={title}
			loading={loading}
			hasDivider={false}
			header_action={compare}
			css={css`
				border-radius: 6px !important;
			`}
		>
			<h1
				css={css`
					font-size: 2.25em !important;
					padding: 0 !important;
				`}
			>
				{children}
			</h1>
			<span
				css={css`
					color: var(--sc-color-gray-500);
				`}
			>
				{description}
			</span>
		</Box>
	);
};
