export default ({ attributes }) => {
	const { currency } = attributes;

	return (
		<sc-choice show-control="false" size="small">
			<sc-price-input
				currencyCode={currency}
				size="small"
				showCode={false}
				showLabel={false}
			/>
		</sc-choice>
	);
};
