/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Step from './Step';
import ProgressIndicator from './ProgressIndicator';
import { useState } from '@wordpress/element';
import { ScAlert, ScFormControl, ScInput } from '@surecart/components-react';

export default ({
	email,
	setUserEmail,
	currentStep,
	handleStepChange,
	onSubmitEmail,
}) => {
	const [error, setError] = useState(null);

	function onSubmit() {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		setError(null);

		if (emailRegex.test(email.trim())) {
			onSubmitEmail(email.trim());
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
				<Step
					width={'520px'}
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
						'Confirm Email for Store Notifications',
						'surecart'
					)}
					label={__(
						'This email is used for store notifications, such as new orders, payment failures and other store emails.',
						'surecart'
					)}
				>
					<ScFormControl label={__('Email Address')}>
						<ScInput
							size="large"
							placeholder={__('Enter email address', 'surecart')}
							required={true}
							autofocus={true}
							type="email"
							value={email}
							onScInput={(e) => setUserEmail(e.target.value)}
						/>
					</ScFormControl>
					<ScAlert open={error} type="danger">
						{error}
					</ScAlert>
				</Step>
			</div>
			<ProgressIndicator
				currentStep={currentStep}
				onBackwardClick={() => handleStepChange('backward')}
				onForwardClick={!!email?.trim().length && onSubmit}
			/>
		</>
	);
};
