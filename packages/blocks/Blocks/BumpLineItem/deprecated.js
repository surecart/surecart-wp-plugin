const v1 = {
	attributes: {
		label: {
			type: 'string',
			default: 'Bundle Discount',
		},
	},
	supports: {
		reusable: false,
		html: false,
	},
	save({ attributes, className }) {
		const { label } = attributes;
		return (
			<sc-line-item-bump
				class={className}
				label={label}
			></sc-line-item-bump>
		);
	},
};

export default [v1];
