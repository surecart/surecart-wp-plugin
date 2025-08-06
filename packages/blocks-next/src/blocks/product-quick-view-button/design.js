import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { __, _x } from '@wordpress/i18n';
import { useToolsPanelDropdownMenuProps } from '../utils';

export default ({ attributes, setAttributes }) => {
	const { quickViewButtonType, width } = attributes;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<ToolsPanel
			label={__('Design', 'surecart')}
			resetAll={() =>
				setAttributes({
					quickViewButtonType: 'both',
					width: null,
				})
			}
			dropdownMenuProps={dropdownMenuProps}
		>
			<ToolsPanelItem
				hasValue={() => !!quickViewButtonType}
				label={__('Icon & Text', 'surecart')}
				onDeselect={() =>
					setAttributes({ quickViewButtonType: 'both' })
				}
				isShownByDefault
			>
				<ToggleGroupControl
					label={__('Icon & Text', 'surecart')}
					value={quickViewButtonType}
					onChange={(quickViewButtonType) =>
						setAttributes({ quickViewButtonType })
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
