/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

export function ProductQuickViewButtonControls({ value, onChange }) {
	return (
		<ToggleGroupControl
			__nextHasNoMarginBottom
			label={__('Button')}
			value={value}
			onChange={onChange}
			help={__(
				'A decorative way to show quick view trigger of the product.'
			)}
			isBlock
		>
			<ToggleGroupControlOption
				value="icon"
				label={_x(
					'Icon',
					'Button option for product quick view button.'
				)}
			/>
			<ToggleGroupControlOption
				value="text"
				label={_x(
					'Text',
					'Button option for product quick view button.'
				)}
			/>
			<ToggleGroupControlOption
				value="both"
				label={_x(
					'Both',
					'Button option for product quick view button.'
				)}
			/>
		</ToggleGroupControl>
	);
}
