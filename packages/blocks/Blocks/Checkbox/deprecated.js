import { RichText } from '@wordpress/block-editor';

const deprecated = [
	{
		// apiVersion 2 save — className was auto-provided by WordPress.
		save({ attributes, className }) {
			const { name, checked, value, required, label } = attributes;

			return (
				<sc-checkbox
					class={className || false}
					name={name || false}
					checked={checked || false}
					value={value || false}
					required={required || false}
				>
					<RichText.Content value={label} />
				</sc-checkbox>
			);
		},
	},
	{
		// v1 — plain label text (before RichText).
		save({ attributes, className }) {
			const { name, checked, value, required, label } = attributes;

			return (
				<sc-checkbox
					class={className || false}
					name={name || false}
					checked={checked || false}
					value={value || false}
					required={required || false}
				>
					{label}
				</sc-checkbox>
			);
		},
	},
];

export default deprecated;
