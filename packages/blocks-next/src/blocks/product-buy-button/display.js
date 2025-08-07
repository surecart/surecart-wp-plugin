import { __, sprintf } from '@wordpress/i18n';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { useToolsPanelDropdownMenuProps } from '../utils';

export default function Display({ attributes, setAttributes, context }) {
	const { width, show_sticky_purchase_button } = attributes;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();
	const hasStickyButton = context?.providerBlock === 'surecart/product-page';

	return (
		<ToolsPanel
			label={__('Display', 'surecart')}
			resetAll={() =>
				setAttributes({
					width: undefined,
					...(hasStickyButton
						? { show_sticky_purchase_button: 'never' }
						: {}),
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

			{hasStickyButton && (
				<ToolsPanelItem
					label={__('Sticky purchase button', 'surecart')}
					isShownByDefault
					hasValue={() => !!show_sticky_purchase_button}
					onDeselect={() =>
						setAttributes({
							show_sticky_purchase_button: 'never',
						})
					}
					__nextHasNoMarginBottom
				>
					<ToggleGroupControl
						label={__('Show sticky button', 'surecart')}
						value={show_sticky_purchase_button}
						onChange={(show_sticky_purchase_button) =>
							setAttributes({
								show_sticky_purchase_button,
							})
						}
						help={
							{
								never: __(
									'Do not show a sticky purchase button when scrolling to the bottom of the page',
									'surecart'
								),
								in_stock: __(
									'Show a sticky purchase button only when the product is in stock',
									'surecart'
								),
								always: __(
									'Always show a sticky purchase button regardless of stock status',
									'surecart'
								),
							}[show_sticky_purchase_button] ||
							__(
								'Show a sticky purchase button when this button is out of view',
								'surecart'
							)
						}
						isBlock
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					>
						<ToggleGroupControlOption
							key={'never'}
							value={'never'}
							label={__('Never', 'surecart')}
						/>
						<ToggleGroupControlOption
							key={'in_stock'}
							value={'in_stock'}
							label={__('In stock', 'surecart')}
						/>
						<ToggleGroupControlOption
							key={'always'}
							value={'always'}
							label={__('Always', 'surecart')}
						/>
					</ToggleGroupControl>
				</ToolsPanelItem>
			)}
		</ToolsPanel>
	);
}
