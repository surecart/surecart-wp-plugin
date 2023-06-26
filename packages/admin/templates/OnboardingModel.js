/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import Notifications from '../components/Notifications';

export default ({ children }) => {
	return (
		<Fragment>
			<Global
				styles={css`
					:root {
						--sc-color-primary-500: var(--sc-color-brand-primary);
						--sc-focus-ring-color-primary: var(
							--sc-color-brand-primary
						);
						--sc-input-border-color-focus: var(
							--sc-color-brand-primary
						);
					}
					#wpcontent {
						margin: 0 !important;
						padding: 0;
						position: fixed;
						top: 0;
						left: 0;
						width: 100vw;
						min-height: 100vh;
						z-index: 999999;
					}
					#wpbody-content {
						padding: 0 !important;
						position: fixed;
						top: 0;
						left: 0;
						z-index: 999999;
					}
					#wpfooter {
						display: none;
					}
					#wpcontent {
						height: 100%;
					}
				`}
			/>
			<div
				css={css`
					height: 100vh;
					width: 100vw;
					display: flex;
					flex-direction: column;
					overflow: hidden;
					background-color: #f0f0f1;
				`}
			>
				{children}
				<Notifications
					css={css`
						position: fixed !important;
						left: auto !important;
						right: 40px;
						bottom: 125px;
						width: auto !important;

						:first-letter {
							text-transform: uppercase;
						}
					`}
				/>
			</div>
		</Fragment>
	);
};
