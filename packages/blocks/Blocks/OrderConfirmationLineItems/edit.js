import { useBlockProps } from '@wordpress/block-editor';
import { ScDashboardModule } from '@surecart/components-react';

export default ({ attributes }) => {
	const { title } = attributes;
	const blockProps = useBlockProps({
		heading: title,
	});

	return (
		<sc-order-confirmation-details
			{...blockProps}
		></sc-order-confirmation-details>
	);
};
