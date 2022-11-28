/**
 * WordPress dependencies.
 */
export default [
	{
		attributes: {
			price_id: {
				type: 'string',
			},
			label: {
				type: 'string',
			},
			description: {
				type: 'string',
			},
			quantity: {
				type: 'number',
			},
			type: {
				type: 'string',
				default: 'radio',
			},
			checked: {
				type: 'boolean',
			},
			show_label: {
				type: 'boolean',
				default: true,
			},
			show_price: {
				type: 'boolean',
				default: true,
			},
			show_control: {
				type: 'boolean',
				default: true,
			},
		},
		supports: {
			className: false,
		},
		save({ attributes }) {
			const {
				price_id,
				type,
				quantity,
				show_price,
				show_label,
				show_control,
				label,
				description,
				checked,
			} = attributes;
			return (
				<sc-price-choice
					price-id={price_id}
					type={type}
					label={label}
					description={description}
					checked={checked}
					show-label={show_label ? '1' : 'false'}
					show-price={show_price ? '1' : 'false'}
					show-control={show_control ? '1' : 'false'}
					quantity={quantity}
				></sc-price-choice>
			);
		},
	},
];
