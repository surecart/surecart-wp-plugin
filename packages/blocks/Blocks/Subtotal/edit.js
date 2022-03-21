export default ({ attributes }) => {
	const { text } = attributes;
	return (
		<sc-line-item-total total="subtotal">
			<span slot="description">{text}</span>
		</sc-line-item-total>
	);
};
