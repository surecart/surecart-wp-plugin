/**
 * WordPress dependencies.
 */
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { useToolsPanelDropdownMenuProps } from '../utils';

export default ({ attributes, setAttributes }) => {
	const { button_type, width, icon_size } = attributes;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<ToolsPanel
			label={__('Design', 'surecart')}
			resetAll={() =>
				setAttributes({
					button_type: 'both',
					width: null,
					icon_size: 15,
				})
			}
			dropdownMenuProps={dropdownMenuProps}
		>
			<ToolsPanelItem
				hasValue={() => !!button_type}
				label={__('Icon & Text', 'surecart')}
				onDeselect={() => setAttributes({ button_type: 'both' })}
				isShownByDefault
			>
				<ToggleGroupControl
					__next40pxDefaultSize
					label={__('Icon & Text', 'surecart')}
					value={button_type}
					onChange={(button_type) => setAttributes({ button_type })}
					help={__(
						'A decorative way to show review add button of the product.',
						'surecart'
					)}
					isBlock
				>
					<ToggleGroupControlOption
						value="icon"
						label={_x(
							'Icon',
							'Button option for product review add button button.',
							'surecart'
						)}
					/>
					<ToggleGroupControlOption
						value="text"
						label={_x(
							'Text',
							'Button option for product review add button button.',
							'surecart'
						)}
					/>
					<ToggleGroupControlOption
						value="both"
						label={_x(
							'Both',
							'Button option for product review add button button.',
							'surecart'
						)}
					/>
				</ToggleGroupControl>
			</ToolsPanelItem>
			<ToolsPanelItem
				label={__('Width', 'surecart')}
				isShownByDefault
				hasValue={() => !!width}
				onDeselect={() => setAttributes({ width: undefined })}
			>
				<ToggleGroupControl
					__next40pxDefaultSize
					label={__('Width', 'surecart')}
					help={__(
						'The width of the button in its container.',
						'surecart'
					)}
					value={width}
					onChange={(width) => setAttributes({ width })}
					isBlock
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
			<ToolsPanelItem
				label={__('Icon Size', 'surecart')}
				hasValue={() => icon_size !== 15}
				onDeselect={() => setAttributes({ icon_size: 15 })}
				isShownByDefault
			>
				<NumberControl
					__next40pxDefaultSize
					label={__('Icon Size', 'surecart')}
					help={__('Size of the icon in pixels.', 'surecart')}
					value={icon_size}
					onChange={(value) =>
						setAttributes({ icon_size: parseInt(value) || 15 })
					}
					min={10}
					max={100}
					step={1}
				/>
			</ToolsPanelItem>
		</ToolsPanel>
	);
};
