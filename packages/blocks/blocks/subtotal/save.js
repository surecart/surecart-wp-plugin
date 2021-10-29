export default ( { attributes } ) => {
	const { text } = attributes;
	return (
		<ce-line-item-total class="ce-subtotal" total="subtotal">
			<span slot="description">{ text }</span>
		</ce-line-item-total>
	);
};
