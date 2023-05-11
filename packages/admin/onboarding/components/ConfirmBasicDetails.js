/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import StepHeader from './StepHeader';
import ProgressIndicator from './ProgressIndicator';
import { useState } from '@wordpress/element';
import {
	ScAlert,
	ScFormControl,
	ScInput,
	ScSelect,
} from '@surecart/components-react';

export default ({
	email,
	currentStep,
	handleStepChange,
	onSubmitEmail,
	currency,
	onSelectCurrency,
}) => {
	const [userEmail, setUserEmail] = useState(email ?? '');
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
			<div>
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
					title={__('Confirm Store Details', 'surecart')}
					label={__(
						'Confirm the details for your store.',
						'surecart'
					)}
				/>
				<div
					css={css`
						margin: 20px auto;
						display: flex;
						flex-direction: column;
						gap: 20px;
						max-width: 370px;
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
					<ScFormControl label={__('Default Currency', 'surecart')}>
						<ScSelect
							required
							search
							size="large"
							onScChange={(e) => onSelectCurrency(e.target.value)}
							value={currency}
							choices={Object.keys(
								scData?.supported_currencies || {}
							).map((value) => {
								const label =
									scData?.supported_currencies[value];
								return {
									label: `${label} (${getCurrencySymbol(
										value
									)})`,
									value,
								};
							})}
							style={{
								fontSize: 'var(--sc-input-font-size-large)',
							}}
						></ScSelect>
					</ScFormControl>
				</div>
				<ScAlert open={error} type="danger">
					{error}
				</ScAlert>
			</div>
			<ProgressIndicator
				currentStep={currentStep}
				onBackwardClick={() => handleStepChange('backward')}
				onForwardClick={
					!!userEmail?.trim().length && !!currency && onSubmit
				}
			/>
		</>
	);
};
