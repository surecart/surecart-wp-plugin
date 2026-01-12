/**
 * External dependencies.
 */
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToolsPanel as ToolsPanel,
	TextControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { useToolsPanelDropdownMenuProps } from '../utils';

export default ({ attributes, setAttributes }) => {
	const { addedLabel } = attributes;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<ToolsPanel
			label={__('Labels', 'surecart')}
			resetAll={() =>
				setAttributes({
					addedLabel: undefined,
				})
			}
			dropdownMenuProps={dropdownMenuProps}
		>
			<ToolsPanelItem
				hasValue={() => !!addedLabel}
				label={__('Added Label', 'surecart')}
				onDeselect={() => setAttributes({ addedLabel: undefined })}
			>
				<TextControl
					label={__('Added Label', 'surecart')}
					help={__(
						'Text shown when the order bump is added to cart.',
						'surecart'
					)}
					placeholder={__('Added', 'surecart')}
					value={addedLabel || ''}
					onChange={(addedLabel) => setAttributes({ addedLabel })}
				/>
			</ToolsPanelItem>
		</ToolsPanel>
	);
};
