/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { ToggleControl } from '@wordpress/components';

const ALLOWED_BLOCKS = [
	'surecart/product-total-rating-value',
	'surecart/product-total-rating-label',
];

const TEMPLATE = [
	['surecart/product-total-rating-value', {}],
	['surecart/product-total-rating-label', {}],
];

export default ({ attributes, setAttributes, __unstableLayoutClassNames }) => {
	const { show_label } = attributes;
	const blockProps = useBlockProps({
		className: __unstableLayoutClassNames,
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: TEMPLATE,
		templateLock: false,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings')}>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Show label text')}
						help={__(
							'Toggle off to hide the label text, e.g. "reviews".'
						)}
						onChange={(value) =>
							setAttributes({ show_label: value })
						}
						checked={show_label}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...innerBlocksProps} />
		</>
	);
};
