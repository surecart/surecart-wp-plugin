import { useBlockProps } from '@wordpress/block-editor';
import { ScOrderConfirmationDetails } from '@surecart/components-react';

export default ({ attributes }) => {
	const { title } = attributes;
	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<ScOrderConfirmationDetails
				heading={title}
			></ScOrderConfirmationDetails>
		</div>
	);
};
