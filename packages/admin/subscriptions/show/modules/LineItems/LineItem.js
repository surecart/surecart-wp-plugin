import { ScFormatNumber, ScLineItem } from '@surecart/components-react';

export default ({ label, currency, value }) => {
	return (
		<ScLineItem>
			<span slot="description">{label}</span>
			<ScFormatNumber
				slot="price"
				style={{
					fontWeight: 'var(--sc-font-weight-semibold)',
					color: 'var(--sc-color-gray-800)',
				}}
				type="currency"
				currency={currency}
				value={value}
			></ScFormatNumber>
		</ScLineItem>
	);
};
