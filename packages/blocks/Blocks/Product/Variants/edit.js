import {
	useBlockProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	useSetting,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	ScProductVariationChoices,
	ScSelect,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import {
	__experimentalUseCustomUnits as useCustomUnits,
	__experimentalUnitControl as UnitControl,
	PanelBody,
} from '@wordpress/components';
import useProductPageWarning from '../../../hooks/useProductPageWarning';
import { useRef, useEffect } from '@wordpress/element';

export default ({ attributes, setAttributes, context }) => {
	const selectColor = useRef();
	const { gap } = attributes;
	const blockProps = useBlockProps();
	const spacingProps = useSpacingProps(attributes);
	const units = useCustomUnits({
		availableUnits: useSetting('spacing.units') || ['%', 'px', 'em', 'rem'],
	});

	const warning = useProductPageWarning();
	if (warning) {
		return <div {...blockProps}>{warning}</div>;
	}

	useEffect(() => {
		if (selectColor.current) {
			selectColor.current.value = 'black';
			selectColor.current.choices = [
				{
					value: 'black',
					label: __('Black', 'surecart'),
				},
				{
					value: 'white',
					label: __('White', 'surecart'),
				},
			];
		}
	}, [selectColor]);

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
							nextGap = 0 > parseFloat(nextGap) ? '0' : nextGap;
							setAttributes({ gap: nextGap });
						}}
						units={units}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ScSelect ref={selectColor} label={__('Color', 'surecart')} />
				<ScProductVariationChoices
					style={{
						...spacingProps.style,
						'--sc-variation-gap': gap,
					}}
					isDummy={true}
				/>
			</div>
		</>
	);
};
