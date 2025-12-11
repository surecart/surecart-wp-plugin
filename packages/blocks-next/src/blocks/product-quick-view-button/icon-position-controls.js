/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

export function IconPositionControls({ value, onChange }) {
	return (
		<ToggleGroupControl
			__nextHasNoMarginBottom
			label={__('Icon Position')}
			value={value}
			onChange={onChange}
			help={__('The position of the icon in the button.')}
			isBlock
		>
			<ToggleGroupControlOption
				value="after"
				label={_x('After', 'The position of the icon in the button.')}
			/>
			<ToggleGroupControlOption
				value="before"
				label={_x('Before', 'The position of the icon in the button.')}
			/>
		</ToggleGroupControl>
	);
}
