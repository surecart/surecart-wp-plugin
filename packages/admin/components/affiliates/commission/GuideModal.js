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
					width: 380px;
					* {
						box-sizing: border-box;
					}

					.components-guide__page {
						min-height: 0;
						padding: 32px;
					}

					.surecart-guide__heading {
						line-height: 1.2;
						margin-top: 0;
					}

					.surecart-guide__text p {
						margin-top: 0;
					}
				`}
				onFinish={onRequestClose}
				finishButtonText={__('Close', 'surecart')}
				pages={[
					{
						content: (
							<Fragment>
								<h2 className="surecart-guide__heading">
									{title}
								</h2>

								<div class="surecart-guide__text">
									{description}
								</div>
							</Fragment>
						),
					},
				]}
			/>
		)
	);
};
