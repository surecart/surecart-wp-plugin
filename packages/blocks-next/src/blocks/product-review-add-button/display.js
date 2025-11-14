/**
 * WordPress dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

/**
 * Internal dependencies.
 */
import { useToolsPanelDropdownMenuProps } from '../utils';

export default function Display({ attributes, setAttributes }) {
	const { width } = attributes;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<ToolsPanel
			label={__('Display', 'surecart')}
			resetAll={() =>
				setAttributes({
					width: undefined,
				})
			}
			dropdownMenuProps={dropdownMenuProps}
		>
			<ToolsPanelItem
				label={__('Width', 'surecart')}
				isShownByDefault
				hasValue={() => !!width}
				onDeselect={() => setAttributes({ width: undefined })}
				__nextHasNoMarginBottom
			>
				<ToggleGroupControl
					label={__('Width', 'surecart')}
					value={width}
					onChange={(width) => setAttributes({ width })}
					isBlock
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				>
					{[25, 50, 75, 100].map((widthValue) => {
						return (
							<ToggleGroupControlOption
								key={widthValue}
								value={widthValue}
								label={sprintf(
									/* translators: Percentage value. */
									__('%d%%', 'surecart'),
									widthValue
								)}
							/>
						);
					})}
				</ToggleGroupControl>
			</ToolsPanelItem>
		</ToolsPanel>
	);
}
