export default ({ attributes }) => {
	const {
		text,
		subscription_text,
		free_trial_text,
		first_payment_total_text,
		className,
	} = attributes;
	return (
		<sc-line-item-total
			class={className}
			total="total"
			size="large"
			show-currency="1"
		>
			<span slot="title">{text}</span>
			<span slot="subscription-title">{subscription_text || text}</span>
			<span slot="first-payment-total-description">
				{first_payment_total_text}
			</span>
			<span slot="free-trial-description">{free_trial_text}</span>
		</sc-line-item-total>
	);
};
