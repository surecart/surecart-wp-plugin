/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Guide } from '@wordpress/components';
import { Fragment } from 'react';

export default ({ open, onRequestClose }) => {
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
						image: (
							<picture class="edit-post-welcome-guide__image">
								<img
									src={`${scData?.plugin_url}/images/guides/integration-step-1.svg`}
									width="312"
									height="240"
									alt=""
								/>
							</picture>
						),
						content: (
							<Fragment>
								<h1 className="surecart-guide__heading">
									{__(
										'Sync purchases with the plugins you already use.',
										'surecart'
									)}
								</h1>

								<p class="surecart-guide__text">
									{__(
										"Leave the heavy-lifting to us. Use SureCart's built-in native integrations with all the plugins you use. Purchases and subscriptions are automatically synced with your plugins.",
										'surecart'
									)}
								</p>
							</Fragment>
						),
					},
					{
						image: (
							<picture class="edit-post-welcome-guide__image">
								<img
									src={`${scData?.plugin_url}/images/guides/integration-step-1.svg`}
									width="312"
									height="240"
									alt=""
								/>
							</picture>
						),
						content: (
							<Fragment>
								<h1 className="surecart-guide__heading">
									{__('Set it and forget it.', 'surecart')}
								</h1>

								<p class="surecart-guide__text">
									{__(
										'Purchases syncing happens in both directions. For example, access is automatically revoked during a subscription cancellation or expiration.',
										'surecart'
									)}
								</p>
							</Fragment>
						),
					},
					{
						image: (
							<picture class="edit-post-welcome-guide__image">
								<img
									src={`${scData?.plugin_url}/images/guides/integration-step-1.svg`}
									width="312"
									height="240"
									alt=""
								/>
							</picture>
						),
						content: (
							<Fragment>
								<h1 className="surecart-guide__heading">
									{__(
										'Grow your store worry-free.',
										'surecart'
									)}
								</h1>

								<p class="surecart-guide__text">
									{__(
										"Since SureCart's integrations are native, there's no need to worry about the complexity of growing your store.",
										'surecart'
									)}
								</p>
							</Fragment>
						),
					},
				]}
			/>
		)
	);
};
