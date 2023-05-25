/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import StepHeader from './StepHeader';
import ProgressIndicator from './ProgressIndicator';
import { useState } from '@wordpress/element';
import { ScAlert, ScFormControl, ScInput } from '@surecart/components-react';

export default ({ email, currentStep, handleStepChange, onSubmitEmail }) => {
	const [userEmail, setUserEmail] = useState(email ?? '');
	const [error, setError] = useState(null);

	function onSubmit() {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		setError(null);

		if (emailRegex.test(userEmail.trim())) {
			onSubmitEmail(userEmail.trim());
			handleStepChange('forward');
		} else {
			setError(__('Invalid email address!', 'surecart'));
		}
	}

	return (
		<>
			<div
				css={css`
					max-width: 520px;
					margin: 0 auto;
				`}
			>
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
					title={__(
						'Confirm Email for Store Notifications.',
						'surecart'
					)}
					label={__(
						'This email is used for store notifications, such as new orders, payment failures and other store emails.',
						'surecart'
					)}
				/>
				<div
					css={css`
						margin: 40px auto 20px;
						max-width: 370px;
						display: flex;
						flex-direction: column;
						gap: 20px;
					`}
				>
					<ScFormControl label={__('Email Address')}>
						<ScInput
							size="large"
							placeholder={__('Enter email address', 'surecart')}
							required={true}
							autofocus={true}
							type="email"
							value={userEmail}
							onScInput={(e) => setUserEmail(e.target.value)}
						/>
					</ScFormControl>
					<ScAlert open={error} type="danger">
						{error}
					</ScAlert>
				</div>
			</div>
			<ProgressIndicator
				currentStep={currentStep}
				onBackwardClick={() => handleStepChange('backward')}
				onForwardClick={!!userEmail?.trim().length && onSubmit}
			/>
		</>
	);
};
