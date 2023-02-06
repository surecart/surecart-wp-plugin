import { ScProductPriceChoices } from '@surecart/components-react';
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default () => {
	const blockProps = useBlockProps();

	return (
		<>
			<ScProductPriceChoices {...blockProps} />
		</>
	);
};
