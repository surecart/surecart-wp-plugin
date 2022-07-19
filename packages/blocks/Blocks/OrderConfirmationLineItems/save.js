import { useBlockProps } from '@wordpress/block-editor';
export default function save() {
	const blockProps = useBlockProps.save();
	return (
		<sc-order-confirmation-details
			{...blockProps}
		></sc-order-confirmation-details>
	);
}
