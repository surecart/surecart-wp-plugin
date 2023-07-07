import {
	useBlockProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	useSetting,
	InspectorControls
} from '@wordpress/block-editor';
import { ScProductVariationChoices } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import {
	__experimentalUseCustomUnits as useCustomUnits,
	__experimentalUnitControl as UnitControl,
	PanelBody
} from '@wordpress/components';
import useProductPageWarning from '../../../hooks/useProductPageWarning';

export default ({ attributes, setAttributes, context }) => {
	const { gap } = attributes;
	const blockProps = useBlockProps();
	const spacingProps = useSpacingProps(attributes);
	const units = useCustomUnits({
		availableUnits: useSetting('spacing.units') || [
			'%',
			'px',
			'em',
			'rem'
		],
	});

	const warning = useProductPageWarning();
	if (warning) {
		return <div {...blockProps}>{warning}</div>;
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Layout')}>
					<UnitControl
						label={__('Gap')}
						labelPosition="edge"
						__unstableInputWidth="80px"
						value={gap || ''}
						onChange={(nextGap) => {
							nextGap =
								0 > parseFloat(nextGap) ? '0' : nextGap;
							setAttributes({ gap: nextGap });
						}}
						units={units}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<ScProductVariationChoices 
					style={{
						...spacingProps.style,
						'--sc-variation-gap': gap
					}}
					isDummy={true}
					/>
			</div>
		</>
	);
};
