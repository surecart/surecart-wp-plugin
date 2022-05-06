/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default [
	{
		attributes: {
			collapsible: {
				type: 'boolean',
			},
			collapsed: {
				type: 'boolean',
			},
			closed_text: {
				type: 'string',
				default: 'Show Summary',
			},
			open_text: {
				type: 'string',
				default: 'Summary',
			},
		},
		save({ attributes }) {
			const { collapsed, collapsible } = attributes;
			return (
				<sc-order-summary
					collapsible={collapsible ? '1' : false}
					collapsed={collapsed ? '1' : false}
				>
					<InnerBlocks.Content />
				</sc-order-summary>
			);
		},
	},
];
