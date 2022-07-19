import useCartStyles from '../../hooks/useCartStyles';

export default function save({ attributes }) {
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
}
