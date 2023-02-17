import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { ScProductItemButton } from '@surecart/components-react';

export default () => {
	const blockProps = useBlockProps();

	return (
		<div style={{ padding: '1rem 0' }} {...blockProps}>
			<ScProductItemButton></ScProductItemButton>
		</div>
	);
};
