import { __ } from '@wordpress/i18n';

import {
	useBlockProps,
	RichText,
	__experimentalUseColorProps as useColorProps,
	InspectorControls,
	useSettings,
} from '@wordpress/block-editor';
import {
	__experimentalUseCustomUnits as useCustomUnits,
	__experimentalUnitControl as UnitControl,
	PanelBody,
} from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
	const { label, width } = attributes;
	const widthWithUnit = Number.isFinite(width) ? width + '%' : width;
	const blockProps = useBlockProps({
		style: { width: widthWithUnit },
	});
	const colorProps = useColorProps(attributes);

	const units = useCustomUnits({
		availableUnits: useSettings('spacing.units') || ['%', 'px', 'em', 'rem'],
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Custom Amount Settings')}>
					<UnitControl
						label={__('Width')}
						labelPosition="edge"
						__unstableInputWidth="80px"
						value={width || ''}
						onChange={(nextWidth) => {
							nextWidth =
								0 > parseFloat(nextWidth) ? '0' : nextWidth;
							setAttributes({ width: nextWidth });
						}}
						units={units}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<RichText
					tagName="label"
					className={`sc-form-label ${colorProps.className}`}
					aria-label={__('Label text', 'surecart')}
					placeholder={__('Add label…', 'surecart')}
					value={label}
					onChange={(label) => setAttributes({ label })}
					withoutInteractiveFormatting
					allowedFormats={['core/bold', 'core/italic']}
				/>
				<div className="sc-input-group">
					<span class="sc-input-group-text" id="basic-addon1">
						{scData?.currency_symbol}
					</span>
					<input
						class="sc-form-control"
						type="number"
						step="0.01"
						onwheel="this.blur()"
					/>
				</div>
			</div>
		</>
	);
};
