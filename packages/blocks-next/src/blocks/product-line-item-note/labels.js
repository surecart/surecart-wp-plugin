import { __ } from '@wordpress/i18n';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	TextControl,
} from '@wordpress/components';
import { useToolsPanelDropdownMenuProps } from '../utils';

export default function Labels({ attributes, setAttributes }) {
	const { placeholder } = attributes;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<ToolsPanel
			label={__('Labels', 'surecart')}
			resetAll={() =>
				setAttributes({
					placeholder: '',
				})
			}
			dropdownMenuProps={dropdownMenuProps}
		>
			<ToolsPanelItem
				label={__('Placeholder', 'surecart')}
				hasValue={() => !!placeholder}
				onDeselect={() =>
					setAttributes({
						placeholder: '',
					})
				}
			>
				<TextControl
					label={__('Placeholder', 'surecart')}
					value={placeholder}
					onChange={(placeholder) => setAttributes({ placeholder })}
					isBlock
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			</ToolsPanelItem>
		</ToolsPanel>
	);
}
