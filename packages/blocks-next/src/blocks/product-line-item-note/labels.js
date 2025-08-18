import { __ } from '@wordpress/i18n';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	TextControl,
} from '@wordpress/components';
import { useToolsPanelDropdownMenuProps } from '../utils';

export default function Labels({ attributes, setAttributes }) {
	const { placeholder, help_text } = attributes;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<ToolsPanel
			label={__('Labels', 'surecart')}
			resetAll={() =>
				setAttributes({
					placeholder: '',
					help_text: '',
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
			<ToolsPanelItem
				label={__('Help Text', 'surecart')}
				hasValue={() => !!help_text}
				onDeselect={() =>
					setAttributes({
						help_text: '',
					})
				}
			>
				<TextControl
					label={__('Help Text', 'surecart')}
					value={help_text}
					onChange={(help_text) => setAttributes({ help_text })}
					help={__(
						'Optional text that appears below the note field to provide additional guidance.',
						'surecart'
					)}
					isBlock
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			</ToolsPanelItem>
		</ToolsPanel>
	);
}
