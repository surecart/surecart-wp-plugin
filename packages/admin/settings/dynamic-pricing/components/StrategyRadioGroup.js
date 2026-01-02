/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { STRATEGY_VALUES, HELP_TEXT_STYLE, getHelpText } from '../utils';
import { __ } from '@wordpress/i18n';
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
		flexDirection="column"
	>
		<ToggleGroupControl
			value={value}
			label={label}
			onChange={onChange}
			isBlock
			__next40pxDefaultSize
		>
			{STRATEGY_VALUES.map((option) => (
				<ToggleGroupControlOption
					key={option}
					value={option}
					label={__(
						option.charAt(0).toUpperCase() + option.slice(1),
						'surecart'
					)}
				/>
			))}
		</ToggleGroupControl>
		<div style={HELP_TEXT_STYLE}>{getHelpText(value, type, target)}</div>
	</ScFlex>
);
