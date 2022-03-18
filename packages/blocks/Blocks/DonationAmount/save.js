export default ({ attributes }) => {
	const { amount, currency } = attributes;
	return (
		<ce-choice show-control="false" size="small" value={amount}>
			<ce-format-number
				type="currency"
				currency={currency}
				value={amount}
				minimum-fraction-digits="0"
			></ce-format-number>
		</ce-choice>
	);
};
