/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Disabled } from '@wordpress/components';

export default ({ label, children, selected }) => {
	return (
		<div>
			<div
				css={css`
					display: flex;
					align-items: center;
					overflow: hidden;
					border-radius: 2px;
					border: 1px solid #f0f0f0;
					height: inherit;
					min-height: 400px;
					max-height: 800px;
					cursor: pointer;
					&:hover {
						border-color: var(--wp-admin-theme-color);
					}
					&:focus,
					&:active {
						box-shadow: inset 0 0 0 1px #fff,
							0 0 0 var(--wp-admin-border-width-focus)
								var(--wp-admin-theme-color);
						outline: 2px solid transparent;
					}
				`}
			>
				{children}
			</div>
			<div
				css={css`
					padding-top: 8px;
					font-size: 12px;
					text-align: center;
				`}
			>
				{label}
			</div>
		</div>
	);
};
