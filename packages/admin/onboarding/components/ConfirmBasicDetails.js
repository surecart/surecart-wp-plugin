/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import StepHeader from './StepHeader';
import ProgressIndicator from './ProgressIndicator';
import { useState } from '@wordpress/element';
import {
	ScAlert,
	ScButton,
	ScFormControl,
	ScIcon,
	ScInput,
	ScSelect,
} from '@surecart/components-react';

export default ({ email, currentStep, handleStepChange, onSubmitEmail }) => {
	const [userEmail, setUserEmail] = useState(email ?? '');
	const [accountCurrency, setAccountCurrency] = useState(null);
	const [error, setError] = useState(null);

	function onSubmit() {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		setError(null);

		if (emailRegex.test(userEmail.trim())) {
			onSubmitEmail(userEmail.trim());
			handleStepChange('forward');
		} else {
			setError('Invalid email address!');
		}
	}

	/**
	 * Get the symbol for the currency.
	 */
	const getCurrencySymbol = (code) => {
		const [currency] = new Intl.NumberFormat(undefined, {
			style: 'currency',
			currency: code,
		}).formatToParts();
		return currency?.value;
	};

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
				<div
					css={css`
						margin: 20px 0 0;
						display: flex;
						flex-direction: column;
						gap: 20px;
					`}
				>
					<ScFormControl label="Email Address">
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
					</ScFormControl>
					<ScSelect
						search
						size="large"
						onScChange={(e) =>
							console.log({ currency: e.target.value })
						}
						choices={Object.keys(
							scData?.supported_currencies || {}
						).map((value) => {
							const label = scData?.supported_currencies[value];
							return {
								label: `${label} (${getCurrencySymbol(value)})`,
								value,
							};
						})}
						label={__('Default Currency', 'surecart')}
						help={__(
							'The default currency for new products.',
							'surecart'
						)}
						required
					></ScSelect>
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
