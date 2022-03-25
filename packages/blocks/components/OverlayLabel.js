/** @jsx jsx */
import { __, _n } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';

export default ({ children }) => {
	return (
		<div
			css={css`
				position: absolute;
				top: 50%;
				left: 50%;
				transform: rotate(-45deg);
				text-align: center;
				opacity: 0.25;
				color: black;
				white-space: nowrap;
				font-size: 18px;
				display: grid;
				align-items: center;
				justify-content: center;
				width: 1px;
				height: 1px;
			`}
		>
			{children}
		</div>
	);
};
