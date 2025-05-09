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
				default: false,
			},
			closed_text: {
				type: 'string',
				default: 'Show Summary',
			},
			open_text: {
				type: 'string',
				default: 'Summary',
			},
			collapsedOnMobile: {
				type: 'boolean',
				default: false,
			},
		},
		migrate(attributes) {
			const collapsedOnDesktop = attributes.collapsible
				? attributes.collapsed
				: false;
			const collapsedOnMobile = attributes.collapsible
				? attributes.collapsed || attributes.collapsedOnMobile
				: false;
			return {
				...attributes,
				collapsedOnDesktop,
				collapsedOnMobile,
			};
		},
		save({ attributes }) {
			const {
				collapsed,
				collapsible,
				collapsedOnMobile,
				closed_text,
				open_text,
			} = attributes;
			return (
				<sc-order-summary
					collapsible={collapsible ? '1' : false}
					collapsed={collapsed ? '1' : false}
					collapsed-on-mobile={collapsedOnMobile ? '1' : false}
					closed-text={closed_text}
					open-text={open_text}
				>
					<InnerBlocks.Content />
				</sc-order-summary>
			);
		},
	},

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
			collapsedOnMobile: {
				type: 'boolean',
				default: false,
			},
		},
		save({ attributes }) {
			const { collapsed, collapsible, collapsedOnMobile } = attributes;
			return (
				<sc-order-summary
					collapsible={collapsible ? '1' : false}
					collapsed={collapsed ? '1' : false}
					collapsedOnMobile={collapsedOnMobile ? '1' : false}
				>
					<InnerBlocks.Content />
				</sc-order-summary>
			);
		},
	},

	{
		attributes: {
			collapsible: {
				type: 'boolean',
			},
			collapsedOnDesktop: {
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
			collapsedOnMobile: {
				type: 'boolean',
				default: false,
			},
		},
		save({ attributes }) {
			const {
				collapsedOnDesktop,
				collapsible,
				closed_text,
				open_text,
				collapsedOnMobile,
			} = attributes;
			return (
				<sc-order-summary
					collapsible={collapsible ? '1' : false}
					collapsed-on-desktop={collapsedOnDesktop ? '1' : false}
					closed-text={closed_text}
					open-text={open_text}
					collapsed-on-mobile={collapsedOnMobile ? '1' : false}
				>
					<InnerBlocks.Content />
				</sc-order-summary>
			);
		},
	},

	{
		attributes: {
			collapsible: {
				type: 'boolean',
			},
			collapsedOnDesktop: {
				type: 'boolean',
			},
			order_summary_text: {
				type: 'string',
				default: 'Summary',
			},
			invoice_summary_text: {
				type: 'string',
				default: 'Invoice Summary',
			},
			collapsedOnMobile: {
				type: 'boolean',
				default: false,
			},
		},
		save({ attributes }) {
			const { collapsible, collapsedOnMobile } = attributes;
			return (
				<sc-order-summary
					collapsible={collapsible ? '1' : false}
					collapsed-on-mobile={collapsedOnMobile ? '1' : false}
				>
					<InnerBlocks.Content />
				</sc-order-summary>
			);
		},
	},
];
