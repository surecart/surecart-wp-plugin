import { __ } from '@wordpress/i18n';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	TextControl,
} from '@wordpress/components';
import { useToolsPanelDropdownMenuProps } from '../utils';

export default function Labels({ attributes, setAttributes }) {
	const { placeholder, helpText } = attributes;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<ToolsPanel
			label={__('Labels', 'surecart')}
			resetAll={() =>
				setAttributes({
					placeholder: '',
					helpText: '',
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
				hasValue={() => !!helpText}
				onDeselect={() =>
					setAttributes({
						helpText: '',
					})
				}
			>
				<TextControl
					label={__('Help Text', 'surecart')}
					value={helpText}
					onChange={(helpText) => setAttributes({ helpText })}
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
