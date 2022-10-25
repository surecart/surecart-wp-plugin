import { CheckboxControl } from '@wordpress/components';

export default ({
	attributes: { disabled_methods },
	setAttributes,
	name,
	help,
	id,
}) => {
	return (
		<CheckboxControl
			label={name}
			help={help}
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
