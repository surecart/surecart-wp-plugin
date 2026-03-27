/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Step from './Step';
import ProgressIndicator from './ProgressIndicator';
import { ScButton, ScIcon } from '@surecart/components-react';
import Content from './Content';
import Icon from '../../templates/Icon';

export default ({ handleStepChange, setCurrentStep }) => {
	return (
		<Content>
			<Step imageNode={<Icon />} textAlign="left" width="480px">
				<h2
					css={css`
						font-size: 34px;
						line-height: 1.2;
						margin: 0;
						text-align: left;
					`}
				>
					{__('Welcome, Let’s Set Up Your Online Store', 'surecart')}
				</h2>
				<p
					css={css`
						text-align: left;
						font-size: 18px;
						margin: 0;
						color: var(--sc-color-gray-500);
						line-height: 1.5;
					`}
				>
					{__(
						'You are a few clicks away from adding e-commerce to your website. SureCart is a cloud powered e-commerce platform that is easy to use, lightweight, and lightning fast.',
						'surecart'
					)}
				</p>
				<div
					css={css`
						display: flex;
						justify-content: flex-start;
						gap: 10px;
						margin: auto;
						width: 100%;
						@media (max-width: 768px) {
							flex-wrap: wrap;
						}
					`}
				>
					<ScButton
						size="large"
						type="primary"
						onClick={() => handleStepChange('forward')}
						css={css`
							flex: 1;
						`}
					>
						<ScIcon
							name="shopping-bag"
							slot="prefix"
							style={{ fontSize: '18px' }}
						/>
						{__('Create New Store', 'surecart')}
					</ScButton>
					{scData?.connect_url && (
						<ScButton
							size="large"
							onClick={() => setCurrentStep(6)}
							css={css`
								flex: 1;
							`}
						>
							<ScIcon
								name="upload-cloud"
								slot="prefix"
								style={{ fontSize: '18px' }}
							/>
							{__('Connect Existing Store', 'surecart')}
						</ScButton>
					)}
				</div>
				<div
					css={css`
						font-size: var(--sc-font-size-small);
						color: var(--sc-color-gray-500);
					`}
				>
					{__('By continuing, you agree to the', 'surecart')}{' '}
					<a
						href="https://surecart.com/terms-and-conditions/"
						css={css`
							color: inherit;
						`}
						target="_blank"
					>
						{__('Terms of Service', 'surecart')}
					</a>{' '}
					{__('and', 'surecart')}{' '}
					<a
						href="https://surecart.com/privacy-policy/"
						css={css`
							color: inherit;
						`}
						target="_blank"
					>
						{__('Privacy Policy', 'surecart')}
					</a>
					.
				</div>
			</Step>

			<ProgressIndicator
				currentStep={0}
				onForwardClick={null}
				onBackwardClick={null}
			/>
		</Content>
	);
};
