const v1 = {
	attributes: {
		title: { type: 'string', default: 'Your Details' },
	},
	save() {
		return <sc-order-confirmation-customer></sc-order-confirmation-customer>;
	},
};
export default [v1];
