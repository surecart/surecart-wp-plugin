import { useBlockProps } from '@wordpress/block-editor';
import { ScOrderConfirmationDetails } from '@surecart/components-react';

export default ({ attributes }) => {
	const { title } = attributes;
	const blockProps = useBlockProps({
		heading: title,
	});

	// Mock order data for edit mode
	const mockOrder = {
		number: '123456',
		status: 'paid',
		currency: 'USD',
		subtotal_display_amount: '$100.00',
		total_display_amount: '$100.00',
		amount_due_display_amount: '$100.00',
		line_items: {
			data: [
				{
					id: 'mock-item-1',
					quantity: 1,
					subtotal_display_amount: '$100.00',
					price: {
						product: {
							name: 'Sample Product',
							line_item_image: '',
						},
						name: '$100.00',
					},
				},
			],
		},
	};

	return (
		<ScOrderConfirmationDetails
			{...blockProps}
			order={mockOrder}
		></ScOrderConfirmationDetails>
	);
};
