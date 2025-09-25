/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';

const ALLOWED_BLOCKS = [
	'surecart/product-average-rating-stars',
	'surecart/product-average-rating-value',
];

const TEMPLATE = [
	['surecart/product-average-rating-stars', {}],
	['surecart/product-average-rating-value', {}],
];

export default ({ attributes, setAttributes, __unstableLayoutClassNames }) => {
	const { show_value, show_for_zero_reviews, style } = attributes;
	const { blockGap } = style?.spacing || {};
	const blockProps = useBlockProps({
		className: __unstableLayoutClassNames,
		style: { gap: blockGap },
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
						label={__('Show value text')}
						help={__(
							'Toggle off to hide the value text, e.g. "reviews".'
						)}
						onChange={(value) =>
							setAttributes({ show_value: value })
						}
						checked={show_value}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Show for zero reviews', 'surecart')}
						help={__(
							'Toggle on to show the average rating even if there are zero reviews.',
							'surecart'
						)}
						onChange={(show_for_zero_reviews) =>
							setAttributes({ show_for_zero_reviews })
						}
						checked={show_for_zero_reviews}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...innerBlocksProps} />
		</>
	);
};
