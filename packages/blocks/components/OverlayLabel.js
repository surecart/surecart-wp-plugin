import { __, _n } from '@wordpress/i18n';

export default ({ children }) => {
	return (
		<div
			style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'rotate(-45deg)',
				textAlign: 'center',
				opacity: 0.25,
				color: 'black',
				whiteSpace: 'nowrap',
				fontSize: '18px',
				display: 'grid',
				alignItems: 'center',
				justifyContent: 'center',
				width: '1px',
				height: '1px',
			}}
		>
			{children}
		</div>
	);
};
