export default ({ attributes }) => {
	const { text } = attributes;
	return (
		<sc-line-item-total class="sc-subtotal" total="subtotal">
			<span slot="description">{text}</span>
		</sc-line-item-total>
	);
};
