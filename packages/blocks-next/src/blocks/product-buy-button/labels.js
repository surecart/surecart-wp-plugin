import { __ } from '@wordpress/i18n';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	TextControl,
} from '@wordpress/components';
import { useToolsPanelDropdownMenuProps } from '../utils';

export default function Labels({ attributes, setAttributes }) {
	const { out_of_stock_text, unavailable_text } = attributes;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<ToolsPanel
			label={__('Labels', 'surecart')}
			resetAll={() =>
				setAttributes({
					out_of_stock_text: '',
					unavailable_text: '',
				})
			}
			dropdownMenuProps={dropdownMenuProps}
		>
			<ToolsPanelItem
				label={__('Out of stock label', 'surecart')}
				hasValue={() => !!out_of_stock_text}
				onDeselect={() =>
					setAttributes({
						out_of_stock_text: '',
					})
				}
			>
				<TextControl
					label={__('Out of stock', 'surecart')}
					value={out_of_stock_text}
					onChange={(out_of_stock_text) =>
						setAttributes({ out_of_stock_text })
					}
					isBlock
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			</ToolsPanelItem>

			<ToolsPanelItem
				label={__('Unavailable', 'surecart')}
				hasValue={() => !!unavailable_text}
				onDeselect={() =>
					setAttributes({
						unavailable_text: '',
					})
				}
			>
				<TextControl
					label={__('Unavailable label', 'surecart')}
					value={unavailable_text}
					onChange={(unavailable_text) =>
						setAttributes({ unavailable_text })
					}
					isBlock
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			</ToolsPanelItem>
		</ToolsPanel>
	);
}