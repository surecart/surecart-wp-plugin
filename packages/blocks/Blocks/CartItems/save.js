import useCartStyles from '../../hooks/useCartStyles';

export default function save({ attributes }) {
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
}
