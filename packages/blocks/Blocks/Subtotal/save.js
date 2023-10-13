export default ({ attributes }) => {
	const {
		text,
		total_payments_text,
		first_payment_subtotal_text,
		className,
	} = attributes;
	return (
		<sc-line-item-total class={className} total="subtotal">
			<span slot="description">{text}</span>
			<span slot="total-payments-description">{total_payments_text}</span>
			<span slot="first-payment-subtotal-description">
				{first_payment_subtotal_text}
			</span>
		</sc-line-item-total>
	);
};
