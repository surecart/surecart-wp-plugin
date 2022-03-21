import { useBlockProps } from '@wordpress/block-editor';
import { CeDashboardModule } from '@surecart/components-react';

export default ({ attributes }) => {
	const { title } = attributes;
	const blockProps = useBlockProps({
		heading: title,
	});

	return (
		<CeDashboardModule {...blockProps}>
			<ce-card>
				<ce-order-confirmation-line-items></ce-order-confirmation-line-items>
				<ce-divider></ce-divider>
				<ce-order-confirmation-totals></ce-order-confirmation-totals>
			</ce-card>
		</CeDashboardModule>
	);
};
