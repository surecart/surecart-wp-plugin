/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import StepHeader from './StepHeader';
import ProgressIndicator from './ProgressIndicator';
import { useState } from '@wordpress/element';
import { ScAlert, ScButton, ScIcon, ScInput } from '@surecart/components-react';

export default ({ email, currentStep, handleStepChange, onSubmitEmail }) => {
	const [userEmail, setUserEmail] = useState(email ?? '');
	const [error, setError] = useState(null);

	function onSubmit() {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		setError(null);

		if (emailRegex.test(userEmail.trim())) {
			onSubmitEmail(userEmail.trim());
		} else {
			setError('Invalid email address!');
		}
	}

	return (
		<>
			<div style={{ margin: 'auto' }}>
				<StepHeader
					imageNode={
						<sc-icon
							name="mail"
							style={{
								fontSize: '38px',
								color: 'var(--sc-color-brand-primary)',
							}}
						></sc-icon>
					}
					title={__('Confirm Store Email', 'surecart')}
					label={__(
						'Confirm an email for your store notifications.',
						'surecart'
					)}
				/>
				<div style={{ margin: '0 0 20px' }}>
					<ScInput
						size="large"
						placeholder={__('Enter email address', 'surecart')}
						required={true}
						autofocus={true}
						type="email"
						style={{ width: '460px' }}
						value={userEmail}
						onScInput={(e) => setUserEmail(e.target.value)}
					>
						<ScButton
							slot="suffix"
							type="text"
							size="medium"
							onClick={onSubmit}
							disabled={!userEmail?.length}
							style={{
								color: 'var(--sc-color-brand-primary)',
								marginRight: 0,
							}}
						>
							<ScIcon
								name="arrow-right"
								style={{ fontSize: 20 }}
							/>
						</ScButton>
					</ScInput>
				</div>
				<ScAlert open={error} type="danger">
					{error}
				</ScAlert>
			</div>
			<ProgressIndicator
				currentStep={currentStep}
				onBackwardClick={() => handleStepChange('backward')}
				onForwardClick={!!userEmail?.trim().length && onSubmit}
			/>
		</>
	);
};
