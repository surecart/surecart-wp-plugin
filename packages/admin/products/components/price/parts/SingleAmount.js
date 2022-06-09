import { __ } from '@wordpress/i18n';
import { ScPriceInput } from '@surecart/components-react';

export default ({ className, price, updatePrice, suffix }) => {
	return (
		<ScPriceInput
			className={className}
			label={
				price?.ad_hoc
					? __('Default Price', 'surecart')
					: __('Price', 'surecart')
			}
			currencyCode={price?.currency || scData.currency_code}
			value={price?.amount}
			name="price"
			onScInput={(e) => {
				updatePrice({ amount: e.target.value });
			}}
			autofocus
			required
		>
			{!!suffix && <span slot="suffix">{suffix}</span>}
		</ScPriceInput>
	);
};
