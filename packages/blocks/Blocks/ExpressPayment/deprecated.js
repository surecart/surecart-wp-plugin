const v1 = {
	attributes: {
		divider_text: { type: 'string', default: 'or' },
	},
	save({ attributes }) {
		return (
			<sc-express-payment
				divider-text={attributes?.divider_text}
			></sc-express-payment>
		);
	},
};
export default [v1];
