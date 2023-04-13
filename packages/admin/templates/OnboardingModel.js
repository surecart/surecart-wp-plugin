/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

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
						padding: 0;
					}
					#wpbody-content {
						padding: 0 !important;
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
					height: calc(100vh - 32px);
					display: flex;
					flex-direction: column;
					overflow: hidden;
				`}
			>
				{children}
			</div>
		</Fragment>
	);
};
