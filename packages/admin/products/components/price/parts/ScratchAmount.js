import { ScPriceInput, ScTooltip, ScIcon } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default ({ className, price, updatePrice, suffix }) => {
	return (
		<ScPriceInput
			className={className}
			label={__('Compare at price', 'surecart')}
			currencyCode={price?.currency || scData.currency_code}
			value={price?.scratch_amount}
			name="price"
			min={price?.amount}
			onScInput={(e) => {
				updatePrice({ scratch_amount: e.target.value });
			}}
		>
			<ScTooltip
				slot="suffix"
				text={__(
					'If this item is on sale, enter a pre-sale price that is greater than the price.',
					'surecart'
				)}
			>
				<ScIcon name="info" />
			</ScTooltip>
			{!!suffix && <span slot="suffix">{suffix}</span>}
		</ScPriceInput>
	);
};
