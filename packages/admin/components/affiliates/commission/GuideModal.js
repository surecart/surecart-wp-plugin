/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Guide } from '@wordpress/components';
import { Fragment } from 'react';

export default ({ open, onRequestClose, title, description }) => {
	return (
		!!open && (
			<Guide
				css={css`
					width: 312px;
					* {
						box-sizing: border-box;
					}

					.surecart-guide__heading {
						font-family: -apple-system, BlinkMacSystemFont, Segoe UI,
							Roboto, Oxygen-Sans, Ubuntu, Cantarell,
							Helvetica Neue, sans-serif;
						font-size: 24px;
						line-height: 1.4;
						margin: 16px 0;
						padding: 0 32px;
					}

					.surecart-guide__text {
						font-size: 13px;
						line-height: 1.4;
						margin: 0 0 24px;
						padding: 0 32px;
					}
				`}
				onFinish={onRequestClose}
				pages={[
					{
						content: (
							<Fragment>
								<h1 className="surecart-guide__heading">
									{title}
								</h1>

								<p class="surecart-guide__text">
									{description}
								</p>
							</Fragment>
						),
					},
				]}
			/>
		)
	);
};
