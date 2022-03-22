import { useBlockProps } from '@wordpress/block-editor';
export default function save({ attributes }) {
	const { title } = attributes;
	const blockProps = useBlockProps.save({
		heading: title,
	});
	return (
		<sc-dashboard-module {...blockProps}>
			<sc-card>
				<sc-order-confirmation-line-items></sc-order-confirmation-line-items>
				<sc-divider></sc-divider>
				<sc-order-confirmation-totals></sc-order-confirmation-totals>
			</sc-card>
		</sc-dashboard-module>
	);
}
