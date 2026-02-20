/**
 * Component Dependencies
 */
import { ScExpressPayment } from '@surecart/components-react';
import { useBlockProps } from '@wordpress/block-editor';
import { Disabled } from '@wordpress/components';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export default ({ attributes }) => {
	const { divider_text } = attributes;
	const blockProps = useBlockProps();
	return (
		<div {...blockProps}>
			<Disabled>
				<ScExpressPayment
					dividerText={divider_text}
					debug
				></ScExpressPayment>
			</Disabled>
		</div>
	);
};
