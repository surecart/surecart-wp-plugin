import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { __, _x } from '@wordpress/i18n';
import { useToolsPanelDropdownMenuProps } from '../utils';

export default ({ attributes, setAttributes }) => {
	const { quick_view_button_type, width } = attributes;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<ToolsPanel
			label={__('Design', 'surecart')}
			resetAll={() =>
				setAttributes({
					quick_view_button_type: 'both',
					width: null,
				})
			}
			dropdownMenuProps={dropdownMenuProps}
		>
			<ToolsPanelItem
				hasValue={() => !!quick_view_button_type}
				label={__('Icon & Text', 'surecart')}
				onDeselect={() =>
					setAttributes({ quick_view_button_type: 'both' })
				}
				isShownByDefault
			>
				<ToggleGroupControl
					label={__('Icon & Text', 'surecart')}
					value={quick_view_button_type}
					onChange={(quick_view_button_type) =>
						setAttributes({ quick_view_button_type })
					}
					help={__(
						'A decorative way to show quick view trigger of the product.',
						'surecart'
					)}
					isBlock
				>
					<ToggleGroupControlOption
						value="icon"
						label={_x(
							'Icon',
							'Button option for product quick view button.',
							'surecart'
						)}
					/>
					<ToggleGroupControlOption
						value="text"
						label={_x(
							'Text',
							'Button option for product quick view button.',
							'surecart'
						)}
					/>
					<ToggleGroupControlOption
						value="both"
						label={_x(
							'Both',
							'Button option for product quick view button.',
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
		</ToolsPanel>
	);
};
