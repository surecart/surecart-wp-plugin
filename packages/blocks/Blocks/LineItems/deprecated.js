const v1 = {
	attributes: {
		removable: {
			type: 'boolean',
			default: true,
		},
		editable: {
			type: 'boolean',
			default: true,
		},
	},
	save({ attributes }) {
		const { removable, editable } = attributes;
		return (
			<sc-line-items
				removable={removable ? '1' : 'false'}
				editable={editable ? '1' : 'false'}
			></sc-line-items>
		);
	},
};

export default [v1];
