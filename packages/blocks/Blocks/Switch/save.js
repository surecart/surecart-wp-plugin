export default ({ className, attributes }) => {
	const { name, checked, value, required, label, description } = attributes;

	return (
		<sc-switch
			class={className || false}
			name={name || false}
			checked={checked || false}
			value={value || false}
			required={required || false}
		>
			{label}
			<span slot="description">{description}</span>
		</sc-switch>
	);
};
