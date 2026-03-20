/**
 * WordPress dependencies.
 */
import { __, _x } from '@wordpress/i18n';
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

export function QueryPaginationArrowControls({ value, onChange }) {
	return (
		<ToggleGroupControl
			__nextHasNoMarginBottom
			label={__('Arrow', 'surecart')}
			value={value}
			onChange={onChange}
			help={__(
				'A decorative arrow for the next and previous page buttons.',
				'surecart'
			)}
			isBlock
		>
			<ToggleGroupControlOption
				value="arrow"
				label={_x('Arrow', 'Arrow option for pagination', 'surecart')}
			/>
			<ToggleGroupControlOption
				value="chevron"
				label={_x('Chevron', 'Arrow option for pagination', 'surecart')}
			/>
		</ToggleGroupControl>
	);
}
