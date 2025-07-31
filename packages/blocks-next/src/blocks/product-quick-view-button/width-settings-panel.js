import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';
import { useToolsPanelDropdownMenuProps } from '../utils';

export function WidthSettingsPanel({ selectedWidth, setAttributes }) {
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<ToolsPanel
			label={__('Width Settings', 'surecart')}
			resetAll={() => setAttributes({ width: undefined })}
			dropdownMenuProps={dropdownMenuProps}
		>
			<ToolsPanelItem
				label={__('Width', 'surecart')}
				isShownByDefault
				hasValue={() => !!selectedWidth}
				onDeselect={() => setAttributes({ width: undefined })}
				__nextHasNoMarginBottom
			>
				<ToggleGroupControl
					label={__('Width', 'surecart')}
					value={selectedWidth}
					onChange={(newWidth) => setAttributes({ width: newWidth })}
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
