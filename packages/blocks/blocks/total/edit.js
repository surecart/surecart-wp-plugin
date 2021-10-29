import { CeLineItemTotal } from '@checkout-engine/components';

export default ( { attributes } ) => {
	const { text, subscription_text } = attributes;

	return (
		<ce-line-item-total total="total" size="large" show-currency>
			<span slot="description">{ text }</span>
			<span slot="subscription-title">{ subscription_text || text }</span>
		</ce-line-item-total>
	);
};
