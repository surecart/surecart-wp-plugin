const v1 = {
	attributes: {
		label: { type: 'string', default: 'Shipping' },
	},
	save({ attributes }) {
		const { label } = attributes;
		return <sc-line-item-shipping label={label}></sc-line-item-shipping>;
	},
};
export default [v1];
