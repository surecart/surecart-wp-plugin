/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Step from './Step';
import ProgressIndicator from './ProgressIndicator';
import { ScFormControl, ScInput, ScSelect } from '@surecart/components-react';
import ColorPopup from '../../../blocks/components/ColorPopup';
import { ScIcon } from '@surecart/components-react';
import { getCurrencySymbol } from '../../util';

export default ({
	currentStep,
	handleStepChange,
	currency,
	onSelectCurrency,
	brandColor,
	onBrandColorChange,
}) => {
	return (
		<>
			<Step
				imageNode={
					<ScIcon
						name="sliders"
						style={{
							fontSize: '38px',
							color: 'var(--sc-color-brand-primary)',
						}}
					/>
				}
				title={__('Confirm Store Details', 'surecart')}
				label={__(
					'Customize and configure your store settings.',
					'surecart'
				)}
			>
				<ScFormControl
					label={__('Brand Color', 'surecart')}
					help={__('You can always change this later.', 'surecart')}
				>
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
								onBrandColorChange(color?.hex.replace('#', ''))
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
				<ScFormControl label={__('Store Currency', 'surecart')}>
					<ScSelect
						required
						search
						size="large"
						onScChange={(e) => onSelectCurrency(e.target.value)}
						value={currency}
						choices={(scData?.supported_currencies || []).map(
							({
								name,
								symbol,
								currency: value,
								flag: icon,
							}) => ({
								label: `${name} (${symbol})`,
								value,
								icon,
							})
						)}
						style={{
							fontSize: 'var(--sc-input-font-size-large)',
						}}
					/>
				</ScFormControl>
			</Step>

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
