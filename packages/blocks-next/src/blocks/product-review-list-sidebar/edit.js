/**
 * WordPress dependencies.
 */
import {
	useBlockProps,
	InspectorControls,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl, TextControl } from '@wordpress/components';

const TEMPLATE = [
	[
		'surecart/product-review-list-filter-tags',
		{
			layout: {
				type: 'flex',
				orientation: 'vertical',
			},
		},
	],
	[
		'surecart/product-review-list-filter-checkboxes',
		{
			layout: {
				type: 'flex',
				orientation: 'vertical',
			},
		},
	],
];

export default ({
	attributes: { open, label },
	setAttributes,
	__unstableLayoutClassNames,
}) => {
	const blockProps = useBlockProps({
		className: `${__unstableLayoutClassNames}`,
	});

	const innerBlockProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
		templateLock: false,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<ToggleControl
						label={__('Open by default', 'surecart')}
						help={__(
							'Do you want sidebar to be open by default?',
							'surecart'
						)}
						checked={open}
						onChange={(open) => setAttributes({ open })}
					/>

					<TextControl
						label={__('Mobile Label', 'surecart')}
						value={label}
						onChange={(label) => setAttributes({ label })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...innerBlockProps} />
		</>
	);
};
