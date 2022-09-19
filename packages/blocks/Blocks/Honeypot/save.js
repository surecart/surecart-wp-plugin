import { RichText } from '@wordpress/block-editor';

export default ({ className, attributes }) => {
	const { name, checked, value, required, label } = attributes;

	return (
		<sc-checkbox
			class={className || false}
			name={name || false}
			checked={checked || false}
			value={value || false}
			required={required || false}
      style="position: absolute; left: -9999px; top: -9999px;"
		>
			<RichText.Content value={label} sometext />
		</sc-checkbox>
	);
};
