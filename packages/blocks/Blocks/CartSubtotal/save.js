export default function save({ attributes, context }) {
	const { label } = attributes;
	const slot = context?.['surecart/slot'] || 'footer';
	return (
		<sc-line-item-total slot={`cart-${slot}`}>
			<span slot="title">{label}</span>
		</sc-line-item-total>
	);
}
