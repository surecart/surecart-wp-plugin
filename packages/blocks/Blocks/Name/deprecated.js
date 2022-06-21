/**
 * WordPress dependencies.
 */

export default [
	{
		attributes: {
			required: {
				typoe: 'boolean',
			},
			label: {
				type: 'string',
				default: 'Name',
			},
			help: {
				type: 'string',
				default: '',
			},
			placeholder: {
				type: 'string',
			},
		},
		save({ attributes, className }) {
			const {
				label,
				help,
				autofocus,
				placeholder,
				showLabel,
				size,
				required,
			} = attributes;

			return (
				<sc-customer-name
					class={className || false}
					label={label || false}
					help={help || false}
					autofocus={autofocus || false}
					placeholder={placeholder || false}
					showLabel={showLabel || false}
					size={size || false}
					required={required}
				></sc-customer-name>
			);
		},
	},
];
