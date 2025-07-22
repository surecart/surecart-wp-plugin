/**
 * WordPress dependencies.
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({ attributes, setAttributes }) => {
	const { width } = attributes;

	const blockProps = useBlockProps({
		style: {
			'--sc-sticky-purchase-width': width,
			maxWidth: width,
			width: '100%',
		},
		className: 'sc-sticky-purchase',
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		style: {
			maxWidth: width,
			width: '100%',
		},
	});

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Sticky Purchase Settings', 'surecart')}
					initialOpen={true}
				>
					<UnitControl
						label={__('Width', 'surecart')}
						labelPosition="top"
						__unstableInputWidth="80px"
						value={width}
						onChange={(value) => setAttributes({ width: value })}
						units={['px']}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...innerBlocksProps}></div>
		</>
	);
};
