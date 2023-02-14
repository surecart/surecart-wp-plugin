export default [
	{
		attributes: {
			required: {
				type: 'boolean',
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
				default: 'Textarea',
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
				default: 'textarea',
			},
		},
		save({ className, attributes }) {
			const {
				label,
				disabled,
				help,
				autofocus,
				autocomplete,
				inputmode,
				max,
				maxlength,
				min,
				minlength,
				name,
				placeholder,
				readonly,
				showLabel,
				size,
				spellcheck,
				value,
				required,
			} = attributes;

			return (
				<sc-textarea
					class={className}
					label={label}
					disabled={disabled ? '1' : null}
					help={help}
					autofocus={autofocus ? '1' : null}
					autocomplete={autocomplete ? '1' : null}
					inputmode={inputmode}
					maxlength={maxlength}
					minlength={minlength}
					name={name}
					placeholder={placeholder}
					readonly={readonly ? '1' : null}
					showLabel={showLabel ? '1' : null}
					size={size ? size : 'medium'}
					spellcheck={spellcheck ? '1' : null}
					value={value}
					required={required ? '1' : null}
				></sc-textarea>
			);
		},
	},
];
