import {
	useBlockProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
} from '@wordpress/block-editor';
import { ScProductVariationChoices } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

import useProductPageWarning from '../../../hooks/useProductPageWarning';

export default ({ attributes, setAttributes, context }) => {
	const blockProps = useBlockProps();
	const spacingProps = useSpacingProps(attributes);

	const warning = useProductPageWarning();
	if (warning) {
		return <div {...blockProps}>{warning}</div>;
	}

	return (
		<div {...blockProps}>
			<ScProductVariationChoices 
				style={{
					paddingTop: spacingProps?.style?.paddingTop,
					paddingLeft: spacingProps?.style?.paddingLeft,
					paddingRight: spacingProps?.style?.paddingRight,
					paddingBottom: spacingProps?.style?.paddingBottom,
					marginTop: spacingProps?.style?.marginTop,
					marginLeft: spacingProps?.style?.marginLeft,
					marginRight: spacingProps?.style?.marginRight,
					marginBottom: spacingProps?.style?.marginBottom,
				}}
				isDummy={true}
			/>
		</div>
	);
};
