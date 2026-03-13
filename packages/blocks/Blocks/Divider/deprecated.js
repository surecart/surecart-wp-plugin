const v1 = {
	attributes: {
		text: { type: 'string' },
	},
	save({ className, attributes }) {
		const { text } = attributes;
		return <sc-divider>{text}</sc-divider>;
	},
};
export default [v1];
