import useCartStyles from '../../hooks/useCartStyles';

export default function save({ attributes }) {
	const { label, className } = attributes;
	const style = useCartStyles({ attributes });
	return (
		<sc-line-item-total className={className} style={style}>
			<span slot="title">{label}</span>
		</sc-line-item-total>
	);
}
