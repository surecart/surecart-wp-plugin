import { CheckboxControl } from '@wordpress/components';

export default ({
	attributes: { disabled_methods },
	setAttributes,
	name,
	help,
	disabled,
	id,
}) => {
	return (
		<CheckboxControl
			style={{
				cursor: disabled ? 'not-allowed' : 'inherit',
				opacity: disabled ? '0.5' : '1',
			}}
			label={name}
			help={help}
			disabled={disabled}
			checked={!(disabled_methods || []).includes(id)}
			onChange={(checked) => {
				if (checked) {
					setAttributes({
						disabled_methods: (disabled_methods || []).filter(
							(disabled) => disabled !== id
						),
					});
				} else {
					setAttributes({
						disabled_methods: [...(disabled_methods || []), id],
					});
				}
			}}
		/>
	);
};
