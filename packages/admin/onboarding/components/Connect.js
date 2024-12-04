/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Step from './Step';
import { ScIcon, ScInput, ScButton, ScForm } from '@surecart/components-react';
import Content from './Content';
import { useState } from 'react';
import { useEntityRecord } from '@wordpress/core-data';
import { createInterpolateElement } from '@wordpress/element';
import Error from '../../components/Error';

export default ({ setCurrentStep }) => {
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);
	const { editedRecord, edit, save, isResolving } = useEntityRecord(
		'surecart',
		'store',
		'settings'
	);

	const onBackwardClick = () => {
		setCurrentStep(0);
	};

	const onSubmit = async () => {
		try {
			setSaving(true);
			setError(null);
			const saved = await save();
			if (!saved?.api_token) {
				throw new Error('Failed to connect store.');
			}
			setCurrentStep(7);
		} catch (error) {
			setError(error.message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<>
			<Content>
				<Step
					imageNode={
						<ScIcon
							name="download-cloud"
							style={{
								fontSize: '38px',
								color: 'var(--sc-color-brand-primary)',
							}}
						></ScIcon>
					}
					title={__('Connect Existing Store', 'surecart')}
				>
					<ScForm onScSubmit={onSubmit}>
						<Error error={error} />
						<ScInput
							label={__('Your API Token')}
							size="large"
							placeholder={__('Enter your api token', 'surecart')}
							required={true}
							autofocus={true}
							type="password"
							value={editedRecord?.api_token}
							togglePassword={true}
							onScInput={(e) =>
								edit({ api_token: e.target.value })
							}
						/>
						<ScButton
							type="primary"
							submit
							full
							size="large"
							busy={isResolving || saving}
							disabled={isResolving || saving}
						>
							{__('Connect', 'surecart')}
							<ScIcon name="arrow-right" slot="suffix" />
						</ScButton>
					</ScForm>

					<div
						css={css`
							font-size: 14px;
							line-height: 1;
							display: flex;
							align-items: center;
							justify-content: space-between;
							flex-wrap: wrap;
							gap: 0.5em;
						`}
					>
						<div
							css={css`
								display: flex;
								align-items: center;
								gap: 0.5em;
								flex: 1;
							`}
						>
							<ScIcon
								name="help-circle"
								css={css`
									color: var(--sc-color-brand-primary);
									font-size: 16px;
								`}
							/>
							<span>
								{createInterpolateElement(
									__(
										'Need help finding your <a>API token</a>?',
										'surecart'
									),
									{
										a: (
											<ScButton
												href="https://app.surecart.com/organizations"
												target="_blank"
												type="link"
											/>
										),
									}
								)}
							</span>
						</div>
						<ScButton
							href="https://surecart.com/docs/add-surecart-api/"
							outline
							target="_blank"
						>
							<ScIcon name="book-open" slot="prefix" />
							{__('Help Doc', 'surecart')}
						</ScButton>
					</div>
				</Step>
			</Content>
			<div
				css={css`
					padding: 0 32px;
					height: 96px;
					border-top: 1px solid #dce0e6;
					display: flex;
					align-items: center;
					justify-content: space-between;
					position: absolute;
					width: 100%;
					box-sizing: border-box;
					left: 0;
					bottom: 0;
					background-color: #f0f0f1;
					@media (max-width: 768px) {
						height: 84px;
						padding: 0 24px;
						border-top: ${onBackwardClick === null &&
						onForwardClick === null &&
						'none'};
					}
				`}
			>
				{!!onBackwardClick && (
					<ScButton
						type="link"
						size="large"
						onClick={onBackwardClick}
						disabled={!onBackwardClick}
					>
						<ScIcon name="arrow-left" slot="prefix" />
						{__('Back', 'surecart')}
					</ScButton>
				)}

				<ScButton
					href="https://surecart.com/docs"
					outline
					target="_blank"
				>
					<ScIcon name="life-buoy" slot="prefix" />
					{__('Knowledge Base', 'surecart')}
					<ScIcon name="external-link" slot="suffix" />
				</ScButton>
			</div>
		</>
	);
};
