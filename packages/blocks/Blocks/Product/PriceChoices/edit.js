import { ScProductPriceChoices } from '@surecart/components-react';
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default ({ attributes }) => {
	const { label } = attributes;
	const blockProps = useBlockProps({
		label,
	});

	return (
		<div {...blockProps}>
			<ScProductPriceChoices />
		</div>
	);
};
