/**
 * External dependencies.
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { TEMPLATE } from './template';

export default ({ attributes, setAttributes }) => {
	const { hideAddedItems } = attributes;
	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<ToggleControl
						label={__('Hide added items', 'surecart')}
						help={__(
							'When enabled, items already added to cart will be hidden from the recommendations.',
							'surecart'
						)}
						checked={hideAddedItems}
						onChange={(value) =>
							setAttributes({ hideAddedItems: value })
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...innerBlocksProps} />
		</>
	);
};
