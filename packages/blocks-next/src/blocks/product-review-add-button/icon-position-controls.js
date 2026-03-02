/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';

export default function IconPositionControls({ value, onChange }) {
	return (
		<ToolbarGroup>
			<ToolbarButton
				icon="arrow-left-alt"
				label={__('Icon Before Text', 'surecart')}
				isPressed={value === 'before'}
				onClick={() => onChange('before')}
			/>
			<ToolbarButton
				icon="arrow-right-alt"
				label={__('Icon After Text', 'surecart')}
				isPressed={value === 'after'}
				onClick={() => onChange('after')}
			/>
		</ToolbarGroup>
	);
}
