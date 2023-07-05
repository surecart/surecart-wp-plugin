import { ScChoices, ScPriceChoiceContainer } from '@surecart/components-react';
import {
	InspectorControls,
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
} from '@wordpress/block-editor';
import {
	Notice,
	PanelBody,
	PanelRow,
	RangeControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import useProductPageWarning from '../../../hooks/useProductPageWarning';

export default ({ attributes, setAttributes, context }) => {
	const { label, columns, show_price } = attributes;
	const blockProps = useBlockProps({
		label,
		showPrice: show_price,
	});

	const borderProps = useBorderProps(attributes);
	const colorProps = useColorProps(attributes);
	const spacingProps = useSpacingProps(attributes);

	const warning = useProductPageWarning();
	if (warning) {
		return <div {...blockProps}>{warning}</div>;
	}

	return (
		<>
			<InspectorControls>
				Variants
			</InspectorControls>

			<div {...blockProps}>
				Variants
			</div>
		</>
	);
};
