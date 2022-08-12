/**
 * WordPress dependencies.
 */

export default [
	{
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
	},
];
