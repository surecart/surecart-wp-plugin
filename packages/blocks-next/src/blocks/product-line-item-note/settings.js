/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	RangeControl,
} from '@wordpress/components';

/**
 * Internal dependencies.
 */
import { useToolsPanelDropdownMenuProps } from '../utils';

export default function Settings({ attributes, setAttributes }) {
	const { no_of_rows } = attributes;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<ToolsPanel
			label={__('Input field', 'surecart')}
			resetAll={() =>
				setAttributes({
					no_of_rows: 2,
				})
			}
			dropdownMenuProps={dropdownMenuProps}
		>
			<ToolsPanelItem
				label={__('Number of rows', 'surecart')}
				hasValue={() => no_of_rows !== 2}
				onDeselect={() =>
					setAttributes({
						no_of_rows: 2,
					})
				}
			>
				<RangeControl
					__nextHasNoMarginBottom
					label={__('Number of rows', 'surecart')}
					value={no_of_rows || 2}
					onChange={(no_of_rows) =>
						setAttributes({ no_of_rows: parseInt(no_of_rows) })
					}
					min={1}
					max={10}
				/>
			</ToolsPanelItem>
		</ToolsPanel>
	);
}
