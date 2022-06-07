/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import ErrorBoundary from '../components/error-boundary';
import admin from '../styles/admin';

export default ({ children, onError }) => {
	return (
		<ErrorBoundary onError={onError}>
			<Global
				styles={css`
					${admin}
					#wpwrap {
						background-color: var(--sc-color-gray-100);
					}
				`}
			/>
			<div
				css={css`
					height: calc(100vh - 100px);
					display: grid;
				`}
			>
				<div
					css={css`
						margin: auto;
						width: 100%;
						max-width: 752px;
					`}
				>
					{children}
				</div>
			</div>
		</ErrorBoundary>
	);
};
