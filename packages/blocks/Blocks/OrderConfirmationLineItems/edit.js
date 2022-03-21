import { useBlockProps } from '@wordpress/block-editor';
import { ScDashboardModule } from '@surecart/components-react';

export default ({ attributes }) => {
	const { title } = attributes;
	const blockProps = useBlockProps({
		heading: title,
	});

	return (
		<ScDashboardModule {...blockProps}>
			<sc-card>
				<sc-order-confirmation-line-items></sc-order-confirmation-line-items>
				<sc-divider></sc-divider>
				<sc-order-confirmation-totals></sc-order-confirmation-totals>
			</sc-card>
		</ScDashboardModule>
	);
};
