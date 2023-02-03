import { ScProductImage } from '@surecart/components-react';
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default () => {
	const blockProps = useBlockProps();

	return (
		<>
			<ScProductImage {...blockProps} />
		</>
	);
};
