/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import StepHeader from './StepHeader';
import ProgressIndicator from './ProgressIndicator';
import apiFetch from '@wordpress/api-fetch';
import { useState } from '@wordpress/element';
import {
	ScBlockUi,
	ScButton,
	ScError,
	ScInput,
} from '@surecart/components-react';

export default ({ currentStep, handleStepChange }) => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');

	async function onSubmit() {
		setError(null);
		setLoading(true);
		try {
			await apiFetch({
				method: 'POST',
				path: 'surecart/v1/public/provisional_accounts/',
				data: {
					account_name: 'Deba Store',
					email: email.trim(),
				},
			});
			handleStepChange('forward');
		} catch (error) {
			setError(error);
		} finally {
			setLoading(false);
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
						style={{ width: '480px' }}
						value={email}
						onScInput={(e) => {
							setEmail(e.target.value);
							if (error) setError(null);
						}}
					>
						<ScButton
							slot="suffix"
							type="text"
							size="medium"
							onClick={onSubmit}
							disabled={!email?.length}
							style={{
								color: 'var(--sc-color-brand-primary)',
								marginRight: 0,
							}}
						>
							{__('Confirm', 'surecart')}
						</ScButton>
					</ScInput>
				</div>
				{error && <ScError error={error} />}
				{loading && <ScBlockUi spinner />}
			</div>
			<ProgressIndicator
				currentStep={currentStep}
				onBackwardClick={() => handleStepChange('backward')}
				onForwardClick={!loading && !!email?.length && onSubmit}
			/>
		</>
	);
};
