import useCartStyles from '../../hooks/useCartStyles';

const v1 = {
	attributes: {
		removable: { type: 'boolean', default: true },
		editable: { type: 'boolean', default: true },
		border: { type: 'boolean', default: true },
		padding: {
			type: 'object',
			default: { top: '1.25em', left: '1.25em', bottom: '1.25em', right: '1.25em' },
		},
		backgroundColor: { type: 'string' },
		textColor: { type: 'string' },
	},
	save({ attributes }) {
		const { removable, editable, className } = attributes;
		const style = useCartStyles({ attributes });
		return (
			<sc-line-items
				className={className}
				style={style}
				removable={removable ? 'true' : 'false'}
				editable={editable ? 'true' : 'false'}
			></sc-line-items>
		);
	},
};
export default [v1];
