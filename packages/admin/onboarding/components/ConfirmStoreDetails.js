/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import StepHeader from './StepHeader';
import ProgressIndicator from './ProgressIndicator';
import {
	ScAlert,
	ScFormControl,
	ScInput,
	ScSelect,
} from '@surecart/components-react';
import ColorPopup from '../../../blocks/components/ColorPopup';

export default ({
	currentStep,
	handleStepChange,
	currency,
	onSelectCurrency,
	brandColor,
	onBrandColorChange,
}) => {
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
						display: flex;
						flex-direction: column;
						gap: 20px;
						margin: 20px auto;
						max-width: 370px;
					`}
				>
					<ScFormControl label={__('Brand Color', 'surecart')}>
						<div
							css={css`
								display: flex;
								align-items: center;
								gap: 0.5em;
							`}
						>
							<ColorPopup
								color={`#${brandColor}`}
								setColor={(color) =>
									onBrandColorChange(
										color?.hex.replace('#', '')
									)
								}
							/>
							<ScInput
								css={css`
									flex: 1;
								`}
								value={brandColor}
								onScInput={(e) =>
									onBrandColorChange(
										e.target.value.replace('#', '')
									)
								}
							>
								<div slot="prefix" style={{ opacity: '0.5' }}>
									#
								</div>
							</ScInput>
						</div>
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
			</div>
			<ProgressIndicator
				currentStep={currentStep}
				onBackwardClick={() => handleStepChange('backward')}
				onForwardClick={
					!!brandColor && !!currency
						? () => handleStepChange('forward')
						: undefined
				}
			/>
		</>
	);
};
