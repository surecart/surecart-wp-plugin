import { useBlockProps } from '@wordpress/block-editor';
export default function save({ attributes }) {
	const { title } = attributes;
	const blockProps = useBlockProps.save({
		heading: title,
	});
	return (
		<ce-dashboard-module {...blockProps}>
			<ce-card>
				<ce-order-confirmation-line-items></ce-order-confirmation-line-items>
				<ce-divider></ce-divider>
				<ce-order-confirmation-totals></ce-order-confirmation-totals>
			</ce-card>
		</ce-dashboard-module>
	);
}
