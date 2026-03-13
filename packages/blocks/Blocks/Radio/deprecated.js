import { RichText } from '@wordpress/block-editor';
import { stripHTML } from '../../util';

const v1 = {
	attributes: {
		label: { type: 'string' },
		value: { type: 'string', default: 'checked' },
		name: { type: 'string' },
	},
	save({ className, attributes }) {
		const { name, checked, value, label } = attributes;
		return (
			<sc-radio
				class={className || false}
				name={name || stripHTML(label) || false}
				checked={checked || false}
				value={value || false}
			>
				<RichText.Content value={label} />
			</sc-radio>
		);
	},
};
export default [v1];
