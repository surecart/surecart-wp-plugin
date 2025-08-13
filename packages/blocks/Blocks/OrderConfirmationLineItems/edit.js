import { useBlockProps } from '@wordpress/block-editor';
import { ScOrderConfirmationDetails } from '@surecart/components-react';

export default ({ attributes }) => {
	const { title } = attributes;
	const blockProps = useBlockProps({
		heading: title,
	});

	return (
		<ScOrderConfirmationDetails
			{...blockProps}
		></ScOrderConfirmationDetails>
	);
};
