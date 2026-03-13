// v2: apiVersion 2 -> 3 migration (className no longer auto-provided).
const v2 = {
	attributes: {
		required: {
			type: 'boolean',
			default: false,
		},
		label: {
			type: 'string',
			default: 'First Name',
		},
		help: {
			type: 'string',
			default: '',
		},
		placeholder: {
			type: 'string',
		},
	},
	save({ className, attributes }) {
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
			<sc-customer-firstname
				class={className || false}
				label={label || false}
				help={help || false}
				autofocus={autofocus || false}
				placeholder={placeholder || false}
				showLabel={showLabel || false}
				size={size || false}
				required={required || false}
			></sc-customer-firstname>
		);
	},
};

// v1: required attribute was stored as string '1'/'0' instead of boolean.
const v1 = {
	attributes: {
		required: {
			type: 'boolean',
			default: false,
		},
		label: {
			type: 'string',
			default: 'First Name',
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
			<sc-customer-firstname
				class={className || false}
				label={label || false}
				help={help || false}
				autofocus={autofocus || false}
				placeholder={placeholder || false}
				showLabel={showLabel || false}
				size={size || false}
				required={required ? '1' : '0'}
			></sc-customer-firstname>
		);
	},
};

export default [v2, v1];
