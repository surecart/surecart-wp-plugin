/**
 * WordPress dependencies.
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	__experimentalUnitControl as UnitControl,
	useSettings,
} from '@wordpress/block-editor';
import {
	PanelBody,
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({ attributes, setAttributes }) => {
	const { width, bottomPosition } = attributes;

	const units = useCustomUnits({
		availableUnits: useSettings('spacing.units') || [
			'%',
			'px',
			'em',
			'rem',
			'vw',
		],
	});

	// Apply custom styling directly to the block for instant preview
	const blockProps = useBlockProps({
		style: {
			'--sc-sticky-purchase-bottom': bottomPosition,
			'--sc-sticky-purchase-width': width,
			maxWidth: width,
			width: '100%',
		},
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: [],
		template: [],
		className: 'sc-sticky-purchase-inner-blocks',
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
						units={units}
					/>

					<UnitControl
						label={__('Bottom Position', 'surecart')}
						labelPosition="top"
						__unstableInputWidth="80px"
						value={bottomPosition}
						onChange={(value) =>
							setAttributes({ bottomPosition: value })
						}
						units={units}
						help={__(
							'Distance from the bottom of the screen.',
							'surecart'
						)}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div {...innerBlocksProps}></div>
			</div>
		</>
	);
};
