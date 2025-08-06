import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToolsPanel as ToolsPanel,
	ToggleControl,
} from '@wordpress/components';
import { __, _x } from '@wordpress/i18n';
import { useToolsPanelDropdownMenuProps } from '../utils';

export default ({ attributes, setAttributes }) => {
	const { direct_add_to_cart } = attributes;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<ToolsPanel
			label={__('Settings', 'surecart')}
			resetAll={() =>
				setAttributes({
					direct_add_to_cart: true,
				})
			}
			dropdownMenuProps={dropdownMenuProps}
		>
			<ToolsPanelItem
				hasValue={() => !!direct_add_to_cart}
				label={__('Direct add to cart', 'surecart')}
				onDeselect={() => setAttributes({ direct_add_to_cart: true })}
				isShownByDefault
			>
				<ToggleControl
					label={__('Direct add to cart', 'surecart')}
					help={__(
						'Add the product directly to cart if it has no options.',
						'surecart'
					)}
					checked={direct_add_to_cart}
					onChange={(direct_add_to_cart) => {
						setAttributes({ direct_add_to_cart });
					}}
				/>
			</ToolsPanelItem>
		</ToolsPanel>
	);
};
