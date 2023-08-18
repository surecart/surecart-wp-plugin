/**
 * WordPress dependencies.
 */
import { RichText } from '@wordpress/block-editor';
import { stripHTML } from '../../util';

export default [
	{
		attributes: {
			required: {
				type: 'boolean',
			},
			name: {
				type: 'string',
				default: 'switch',
			},
			value: {
				type: 'string',
				default: 'on',
			},
			label: {
				type: 'string',
				default: 'Switch',
			},
			description: {
				type: 'string',
			},
			help: {
				type: 'string',
			},
			checked: {
				type: 'boolean',
			},
		},
		save({ attributes, className }) {
			const { name, checked, value, required, label, description } =
				attributes;

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
						<span slot="description">{stripHTML(description)}</span>
					)}
				</sc-switch>
			);
		},
	},
	{
		attributes: {
			required: {
				type: 'boolean',
			},
			name: {
				type: 'string',
				default: 'switch',
			},
			value: {
				type: 'string',
				default: 'on',
			},
			label: {
				type: 'string',
				default: 'Switch',
			},
			description: {
				type: 'string',
			},
			help: {
				type: 'string',
			},
			checked: {
				type: 'boolean',
			},
		},
		save({ attributes }) {
			const { name, checked, required, label, description, className } =
				attributes;

			return (
				<sc-switch
					class={className || false}
					name={name || false}
					checked={checked || false}
					required={required || false}
				>
					{label}
					<span slot="description">{description}</span>
				</sc-switch>
			);
		},
	},
];
