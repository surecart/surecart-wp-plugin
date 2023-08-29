import { RichText } from '@wordpress/block-editor';

export default ({ className, attributes }) => {
	const { name, checked, value, required, label, description } = attributes;

	return (
		<sc-switch
			class={className || false}
			name={name || false}
			checked={checked || false}
			value={value || false}
			required={required || false}
		>
			<RichText.Content value={label} />
			{!!description?.length && (
				<span slot="description">
					<RichText.Content value={description} />
				</span>
			)}
		</sc-switch>
	);
};
