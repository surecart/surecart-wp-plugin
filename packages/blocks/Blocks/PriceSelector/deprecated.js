/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';
export default [
	{
		attributes: {
			label: {
				type: 'string',
			},
			choices: {
				type: 'array',
				default: [],
			},
			type: {
				type: 'string',
				default: 'radio',
			},
			columns: {
				type: 'number',
				default: 1,
			},
		},
		supports: {
			className: false,
		},
		save({ attributes }) {
			const { label, type, columns } = attributes;
			return (
				<sc-price-choices label={label} type={type} columns={columns}>
					<div>
						<InnerBlocks.Content />
					</div>
				</sc-price-choices>
			);
		},
	},
];
