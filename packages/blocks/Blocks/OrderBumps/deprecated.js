const v1 = {
	attributes: {
		label: { type: 'string', default: 'Recommended' },
		show_control: { type: 'boolean', default: true },
	},
	save({ attributes, className }) {
		const { label, show_control } = attributes;
		return (
			<sc-order-bumps
				className={className}
				label={label}
				show-control={show_control ? '1' : 'false'}
			></sc-order-bumps>
		);
	},
};
export default [v1];
