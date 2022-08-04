/**
 * WordPress dependencies.
 */

export default [
	{
		attributes: {
			text: {
				type: 'string',
				default: 'Subtotal',
			},
		},
		save({ attributes }) {
			const { text, className } = attributes;
			return (
				<sc-line-item-total class="sc-subtotal" total="subtotal">
					<span slot="description">{text}</span>
				</sc-line-item-total>
			);
		},
	},
];
