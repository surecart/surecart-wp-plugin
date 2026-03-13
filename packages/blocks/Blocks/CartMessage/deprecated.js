import useCartStyles from '../../hooks/useCartStyles';

const v1 = {
	attributes: {
		text: { type: 'string' },
		align: { type: 'string', default: 'left' },
		border: { type: 'boolean', default: true },
		padding: {
			type: 'object',
			default: { top: '1.25em', left: '1.25em', bottom: '1.25em', right: '1.25em' },
		},
		backgroundColor: { type: 'string' },
		textColor: { type: 'string' },
	},
	save({ attributes }) {
		const { text, align, className } = attributes;
		const style = useCartStyles({ attributes });
		return (
			<div style={style} className={className}>
				<sc-text
					style={{
						'--font-size': 'var(--sc-font-size-x-small)',
						'--line-height': 'var(--sc-line-height-dense)',
						'--text-align': align,
					}}
				>
					{text}
				</sc-text>
			</div>
		);
	},
};
export default [v1];
