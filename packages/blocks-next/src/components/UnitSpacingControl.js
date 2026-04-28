/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	BaseControl,
	RangeControl,
	__experimentalUnitControl as UnitControl,
	__experimentalHStack as HStack,
} from '@wordpress/components';

/**
 * A combined UnitControl and RangeControl for spacing/sizing values.
 *
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the control
 * @param {string} props.value - Current value with unit (e.g., "20px")
 * @param {Function} props.onChange - Callback when value changes
 * @param {number} props.min - Minimum value for range slider
 * @param {number} props.max - Maximum value for range slider
 * @param {Array} props.units - Available units for UnitControl
 */
export default function UnitSpacingControl({
	label,
	value,
	onChange,
	min = 0,
	max = 100,
	units = [
		{ value: 'px', label: 'px' },
		{ value: 'em', label: 'em' },
		{ value: 'rem', label: 'rem' },
		{ value: '%', label: '%' },
	],
}) {
	return (
		<BaseControl __nextHasNoMarginBottom label={label}>
			<HStack spacing={4}>
				<UnitControl
					value={value}
					onChange={onChange}
					units={units}
					__next40pxDefaultSize
					css={css`
						flex: 1;
					`}
				/>
				<RangeControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					value={parseInt(value) || 0}
					onChange={(newValue) => {
						// Extract current unit from value, default to 'px'
						const currentUnit =
							value?.match(/[a-z%]+$/i)?.[0] || 'px';
						onChange(`${newValue}${currentUnit}`);
					}}
					min={min}
					max={max}
					withInputField={false}
					css={css`
						flex: 1;
					`}
				/>
			</HStack>
		</BaseControl>
	);
}
