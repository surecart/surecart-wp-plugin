/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { STRATEGY_VALUES, STRATEGY_LABELS, getHelpText } from '../utils';
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { ScFlex } from '@surecart/components-react';

export const StrategyRadioGroup = ({
	label,
	value,
	onChange,
	type,
	target,
}) => (
	<ScFlex
		style={{
			'--sc-flex-column-gap': '0',
			'--sc-flex-space-between': 'flex-start',
			width: '100%',
		}}
		css={css`
			font-size: 16px;
			.components-base-control__label {
				color: var(--sc-input-label-color);
				font-weight: var(--sc-input-label-font-weight);
				text-transform: var(--sc-input-label-text-transform, none);
				letter-spacing: var(--sc-input-label-letter-spacing, 0);
				font-size: var(--sc-input-label-font-size-medium);
			}
			.components-base-control__help {
				color: var(--sc-input-help-text-color);
				font-size: 12px;
				margin-bottom: 0;
			}
		`}
		flexDirection="column"
	>
		<ToggleGroupControl
			value={value}
			label={label}
			onChange={onChange}
			help={getHelpText(value, type, target)}
			isBlock
			__next40pxDefaultSize
		>
			{STRATEGY_VALUES.map((option) => (
				<ToggleGroupControlOption
					key={option}
					value={option}
					label={STRATEGY_LABELS[option]}
				/>
			))}
		</ToggleGroupControl>
	</ScFlex>
);
