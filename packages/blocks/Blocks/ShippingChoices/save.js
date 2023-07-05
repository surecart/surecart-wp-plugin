export default ({ className, attributes }) => {
	const { showControl, label, showDescription } = attributes;

	return (
		<sc-shipping-choices
			show-control={showControl ? 'true' : 'false'}
			show-description={showDescription ? 'true' : 'false'}
			label={label}
			class={className || false}
		></sc-shipping-choices>
	);
};
