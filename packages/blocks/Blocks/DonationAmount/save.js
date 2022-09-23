export default ({ attributes }) => {
	const { label, amount, currency } = attributes;
  console.log(attributes);
	return (
		<sc-choice show-control="false" size="small" value={amount}>
			{!!label ? label : <sc-format-number
				type="currency"
				currency={currency}
				value={amount}
				minimum-fraction-digits="0"
			></sc-format-number>}
		</sc-choice>
	);
};
