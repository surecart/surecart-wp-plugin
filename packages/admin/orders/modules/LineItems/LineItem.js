import { ScLineItem } from '@surecart/components-react';

export default ({ label, currency, value }) => {
	return (
		<ScLineItem>
			<span slot="description">{label}</span>
			<sc-format-number
				slot="price"
				style={{
					'font-weight': 'var(--sc-font-weight-semibold)',
					color: 'var(--sc-color-gray-800)',
				}}
				type="currency"
				currency={currency}
				value={value}
			></sc-format-number>
		</ScLineItem>
	);
};
