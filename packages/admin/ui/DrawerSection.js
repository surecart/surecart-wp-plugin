import { __ } from '@wordpress/i18n';
export default ({ title, children, style }) => {
	if (!children) {
		return null;
	}
	return (
		<div
			style={{
				display: 'grid',
				gap: '2em',
				borderTop: '1px solid #ccc',
				marginLeft: '-30px',
				marginRight: '-30px',
				padding: '2em 30px',
				...style,
			}}
		>
			{title && <h3 style={{ margin: 0 }}>{__(title)}</h3>}
			{children}
		</div>
	);
};
