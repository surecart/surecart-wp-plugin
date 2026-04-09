const v1 = {
	attributes: {
		label: { type: 'string', default: 'Shipping' },
		showControl: { type: 'boolean', default: true },
		showDescription: { type: 'boolean', default: true },
	},
	save({ className, attributes }) {
		const { showControl, label, showDescription } = attributes;
		return (
			<sc-shipping-choices
				show-control={showControl ? 'true' : 'false'}
				show-description={showDescription ? 'true' : 'false'}
				label={label}
				class={className || false}
			></sc-shipping-choices>
		);
	},
};
export default [v1];
