import { ScFlex, ScRadioGroup, ScRadio } from '@surecart/components-react';
import {
	FLEX_STYLE,
	STRATEGY_VALUES,
	HELP_TEXT_STYLE,
	getHelpText,
} from '../utils';
import { __ } from '@wordpress/i18n';

export const StrategyRadioGroup = ({
	label,
	value,
	onChange,
	type,
	target,
}) => (
	<ScRadioGroup label={label} onScChange={onChange}>
		<ScFlex style={FLEX_STYLE}>
			{STRATEGY_VALUES.map((option) => (
				<ScRadio key={option} value={option} checked={option === value}>
					{__(
						option.charAt(0).toUpperCase() + option.slice(1),
						'surecart'
					)}
				</ScRadio>
			))}
		</ScFlex>

		<div style={HELP_TEXT_STYLE}>{getHelpText(value, type, target)}</div>
	</ScRadioGroup>
);
