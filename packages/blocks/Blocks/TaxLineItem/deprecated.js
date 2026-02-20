const v1 = {
	attributes: {
		text: {
			type: 'string',
			default: 'Estimated Tax',
		},
	},
	save() {
		return <sc-line-item-tax></sc-line-item-tax>;
	},
};

export default [v1];
