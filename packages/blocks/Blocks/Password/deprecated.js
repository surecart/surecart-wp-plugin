/**
 * WordPress dependencies.
 */

const v1 = {
	attributes: {
		required: {
			typoe: 'boolean',
		},
		value: {
			type: 'string',
			default: '',
		},
		placeholder: {
			type: 'string',
			default: '',
		},
		disabled: {
			type: 'boolean',
			default: false,
		},
		size: {
			type: 'string',
			default: '',
		},
		label: {
			type: 'string',
			default: 'Password',
		},
		help: {
			type: 'string',
		},
		inputmode: {
			type: 'string',
		},
		max: {
			type: ['string', 'number'],
		},
		maxlength: {
			type: 'number',
		},
		name: {
			type: 'string',
		},
	},
	save({ attributes, className }) {
		const {
			label,
			help,
			autofocus,
			maxlength,
			minlength,
			placeholder,
			showLabel,
			size,
			value,
			required,
		} = attributes;

		return (
			<sc-order-password
				class={className}
				label={label}
				help={help}
				autofocus={autofocus}
				maxlength={maxlength}
				minlength={minlength}
				placeholder={placeholder}
				showLabel={showLabel}
				size={size ? size : 'medium'}
				type="password"
				name="password"
				value={value}
				required={required}
			></sc-order-password>
		);
	},
};

const v2 = {
	attributes: {
		required: {
			type: 'boolean',
		},
		autofocus: {
			type: 'boolean',
			default: false,
		},
		showLabel: {
			type: 'boolean',
			default: true,
		},
		value: {
			type: 'string',
			default: '',
		},
		placeholder: {
			type: 'string',
			default: '',
		},
		disabled: {
			type: 'boolean',
			default: false,
		},
		size: {
			type: 'string',
			default: '',
		},
		label: {
			type: 'string',
			default: 'Set A Password',
		},
		help: {
			type: 'string',
		},
		inputmode: {
			type: 'string',
		},
		max: {
			type: ['string', 'number'],
		},
		maxlength: {
			type: 'number',
		},
		name: {
			type: 'string',
		},
		confirmation: {
			type: 'boolean',
			default: false,
		},
		confirmation_label: {
			type: 'string',
			default: 'Password Confirmation',
		},
		confirmation_placeholder: {
			type: 'string',
			default: '',
		},
		confirmation_help: {
			type: 'string',
		},
	},
	save({ attributes, className }) {
		const {
			label,
			help,
			autofocus,
			maxlength,
			minlength,
			placeholder,
			showLabel,
			size,
			value,
			required,
			confirmation,
			confirmation_label,
			confirmation_placeholder,
			confirmation_help,
		} = attributes;
		return (
			<sc-order-password
				class={className}
				label={label}
				help={help}
				autofocus={autofocus}
				maxlength={maxlength}
				minlength={minlength}
				placeholder={placeholder}
				showLabel={showLabel}
				size={size ? size : 'medium'}
				type="password"
				name="password"
				value={value}
				required={required}
				confirmation={confirmation ? '1' : null}
				confirmation-label={confirmation_label}
				confirmation-placeholder={confirmation_placeholder}
				confirmation-help={confirmation_help}
			></sc-order-password>
		);
	},
};

export default [v1, v2];
