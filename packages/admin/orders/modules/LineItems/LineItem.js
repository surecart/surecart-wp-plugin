import { ScFormatNumber, ScLineItem } from '@surecart/components-react';

export default ({ title, label, currency, value }) => {
	return (
		<ScLineItem>
			{title && <span slot="title">{title}</span>}
			<span slot="description">{label}</span>
			<ScFormatNumber
				slot="price"
				style={{
					'font-weight': 'var(--sc-font-weight-semibold)',
					color: 'var(--sc-color-gray-800)',
				}}
				type="currency"
				currency={currency}
				value={value}
			></ScFormatNumber>
		</ScLineItem>
	);
};
