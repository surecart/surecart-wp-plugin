/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	__experimentalGetElementClassName,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	__experimentalUnitControl as UnitControl,
	PanelBody,
} from '@wordpress/components';
export default ({ attributes, setAttributes }) => {
	const { width } = attributes;
	const blockProps = useBlockProps({
		style: {
			...(width ? { 'min-width': width } : undefined),
		},
	});
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: [
			'surecart/product-quantity-input-decrease',
			'surecart/product-quantity-input',
			'surecart/product-quantity-input-increase',
		],
		template: [
			['surecart/product-quantity-input-decrease', {}],
			['surecart/product-quantity-input', {}],
			['surecart/product-quantity-input-increase', {}],
		],
		templateLock: false,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<UnitControl
						label={__('Width', 'surecart')}
						labelPosition="edge"
						__unstableInputWidth="80px"
						value={width || ''}
						onChange={(nextWidth) => {
							nextWidth =
								0 > parseFloat(nextWidth) ? '0' : nextWidth;
							setAttributes({ width: nextWidth });
						}}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...innerBlocksProps} />
		</>
	);
};
