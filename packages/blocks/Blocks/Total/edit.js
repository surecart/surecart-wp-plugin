export default ({ attributes }) => {
	const { text, subscription_text } = attributes;

	return (
		<sc-line-item-total total="total" size="large" show-currency>
			<span slot="description">{text}</span>
			<span slot="subscription-title">{subscription_text || text}</span>
		</sc-line-item-total>
	);
};
