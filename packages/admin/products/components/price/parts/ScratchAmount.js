import { __ } from '@wordpress/i18n';
import { ScPriceInput } from '@surecart/components-react';

export default ({ className, price, updatePrice, suffix }) => {
	return (
		<ScPriceInput
			className={className}
			label={__('Compare at price', 'surecart')}
			currencyCode={price?.currency || scData.currency_code}
			value={price?.scratch_amount}
			name="price"
			help={__(
				'If this item is on sale, enter a pre-sale price that is greater than the price.',
				'surecart'
			)}
			min={price?.amount + 1}
			onScInput={(e) => {
				updatePrice({ scratch_amount: e.target.value });
			}}
		>
			{!!suffix && <span slot="suffix">{suffix}</span>}
		</ScPriceInput>
	);
};
