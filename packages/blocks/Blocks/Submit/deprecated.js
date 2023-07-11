/**
 * WordPress dependencies.
 */

export default [
	{
		attributes: {
			text: {
				type: 'string',
				default: 'Purchase',
			},
			type: {
				type: 'string',
				default: 'primary',
			},
			show_total: {
				type: 'boolean',
				default: false,
			},
			show_icon: {
				type: 'boolean',
				default: true,
			},
			full: {
				type: 'boolean',
				default: false,
			},
			size: {
				type: 'string',
				default: 'large',
			},
		},
		supports: {
			reusable: false,
			html: false,
			multiple: false,
		},
		save({ attributes }) {
			const { type, full, size, text, show_total, show_icon } =
				attributes;

			return (
				<sc-order-submit
					type={type}
					full={full ? 'true' : false}
					size={size}
					icon={show_icon ? 'lock' : false}
					show-total={show_total ? 'true' : false}
				>
					{text}
				</sc-order-submit>
			);
		},
	},
];
