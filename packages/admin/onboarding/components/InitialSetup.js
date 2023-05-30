/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Step from './Step';
import ProgressIndicator from './ProgressIndicator';
import { ScButton } from '@surecart/components-react';
import Content from './Content';
import Icon from '../../templates/Icon';

export default ({ handleStepChange }) => {
	return (
		<Content>
			<Step
				imageNode={<Icon />}
				title={__('Welcome To SureCart', 'surecart')}
				label={__(
					'Make Your E-Commerce Life Easy With SureCart.',
					'surecart'
				)}
			>
				<div
					css={css`
						display: flex;
						justify-content: center;
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
						style={{ width: '50%' }}
						onClick={() => handleStepChange('forward')}
					>
						<sc-icon
							name="shopping-bag"
							slot="prefix"
							style={{ fontSize: '18px' }}
						></sc-icon>
						{__('Create New Store', 'surecart')}
					</ScButton>
					{scData?.connect_url && (
						<ScButton
							size="large"
							style={{ width: '50%' }}
							href={scData.connect_url}
						>
							<sc-icon
								name="upload-cloud"
								slot="prefix"
								style={{ fontSize: '18px' }}
							></sc-icon>
							{__('Connect Existing Store', 'surecart')}
						</ScButton>
					)}
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
