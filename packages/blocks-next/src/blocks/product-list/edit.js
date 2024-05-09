import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	UnitControl as __stableUnitControl,
	__experimentalUnitControl,
} from '@wordpress/components';

import { TEMPLATE } from './template';

export default function ProductListEdit({
	setAttributes,
	attributes: { limit },
}) {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
	});
	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<RangeControl
						label={__('Products Per Page', 'surecart')}
						value={limit}
						onChange={(limit) => setAttributes({ limit })}
						step={1}
						min={1}
						max={40}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...innerBlocksProps} />
		</>
	);
}
