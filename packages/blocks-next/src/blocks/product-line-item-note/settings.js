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
	const { noOfRows } = attributes;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<ToolsPanel
			label={__('Textarea Settings', 'surecart')}
			resetAll={() =>
				setAttributes({
					noOfRows: 2,
				})
			}
			dropdownMenuProps={dropdownMenuProps}
		>
			<ToolsPanelItem
				label={__('Number of Rows', 'surecart')}
				hasValue={() => noOfRows !== 2}
				onDeselect={() =>
					setAttributes({
						noOfRows: 2,
					})
				}
			>
				<RangeControl
					__nextHasNoMarginBottom
					label={__('Number of Rows', 'surecart')}
					value={noOfRows || 2}
					onChange={(noOfRows) =>
						setAttributes({ noOfRows: parseInt(noOfRows) })
					}
					min={1}
					max={10}
				/>
			</ToolsPanelItem>
		</ToolsPanel>
	);
}
