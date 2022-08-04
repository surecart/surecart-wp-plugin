export default ({ attributes }) => {
	const { text, className } = attributes;
	return (
		<sc-line-item-total class={className} total="subtotal">
			<span slot="description">{text}</span>
		</sc-line-item-total>
	);
};
