export default ({ attributes }) => {
	const { text, subscription_text, className } = attributes;
	return (
		<sc-line-item-total
			class={`sc-line-item-total ${className}`}
			total="total"
			size="large"
			show-currency="1"
		>
			<span slot="title">{text}</span>
			<span slot="subscription-title">{subscription_text || text}</span>
		</sc-line-item-total>
	);
};
