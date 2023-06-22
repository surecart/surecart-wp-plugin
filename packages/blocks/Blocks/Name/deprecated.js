/**
 * WordPress dependencies.
 */

export default [
	{
		attributes: {
			required: {
				type: 'boolean',
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
	{
		attributes: {
			required: {
				type: 'boolean',
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
					required={required ? '1' : '0'}
				></sc-customer-name>
			);
		},
	},
];
