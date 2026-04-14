const v1 = {
	attributes: {
		value: { type: 'string', default: 'customer.name' },
		label: { type: 'string', default: 'Customer Name' },
	},
	save({ attributes }) {
		const { value, label } = attributes;
		return <sc-session-detail label={label} value={value}></sc-session-detail>;
	},
};
export default [v1];
