import { ScFormControl, ScQuantitySelect } from '@surecart/components-react';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import {
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetElementClassName,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default ({ attributes, setAttributes }) => {
	const { label } = attributes;
	const { style: borderStyle } = useBorderProps(attributes);
	const { style: colorStyle } = useColorProps(attributes);

	const blockProps = useBlockProps({
		style: {
			display: 'block',
			...(colorStyle?.color
				? {
						'--sc-input-label-color': colorStyle.color,
						'--sc-focus-ring-color-primary': colorStyle.color,
						'--sc-input-border-color-focus': colorStyle.color,
				  }
				: {}),
		},
		label,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ScFormControl>
					<ScQuantitySelect
						style={{
							...(borderStyle?.borderRadius
								? {
										'--border-radius':
											borderStyle.borderRadius,
								  }
								: {}),
						}}
					/>
				</ScFormControl>
			</div>
		</>
	);
};
