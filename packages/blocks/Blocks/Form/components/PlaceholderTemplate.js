export default ({
	header,
	footerLeft,
	footerRight,
	children,
	maxHeight,
	minHeight,
}) => {
	return (
		<div
			style={{
				background: '#fff',
				fontFamily: 'var(--sc-font-sans)',
				fontSize: '14px',
				boxSizing: 'border-box',
				position: 'relative',
				minHeight: '200px',
				width: '100%',
				textAlign: 'left',
				margin: 0,
				color: '#1e1e1e',
				MozFontSmoothing: 'subpixel-antialiased',
				WebkitFontSmoothing: 'subpixel-antialiased',
				borderRadius: '2px',
				backgroundColor: '#fff',
				border: '1px solid #ddd',
				outline: '1px solid transparent',
				'--sc-color-primary-500': 'var(--wp-admin-theme-color)',
				'--sc-focus-ring-color-primary': 'var(--wp-admin-theme-color)',
				'--sc-input-border-color-focus': 'var(--wp-admin-theme-color)',
				'--sc-color-primary-text': '#fff',
			}}
		>
			<div
				style={{
					width: '100%',
					position: 'relative',
				}}
			>
				<div
					style={{
						position: maxHeight ? 'sticky' : 'relative',
						top: 0,
						left: 0,
						right: 0,
						borderBottom: '1px solid #ddd',
						padding: '0 16px',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'flex-start',
						alignItems: 'center',
						height: '60px',
						fontSize: '1rem',
						fontWeight: 600,
					}}
				>
					{header}
				</div>
				<div
					style={{
						position: 'relative',
						minHeight: minHeight || 'none',
						maxHeight: maxHeight || 'none',
						overflow: maxHeight ? 'auto' : 'visible',
					}}
				>
					{children}
				</div>
				<div
					style={{
						background: '#fff',
						position: maxHeight ? 'sticky' : 'relative',
						bottom: 0,
						left: 0,
						right: 0,
						borderTop: '1px solid #ddd',
						padding: '0 16px',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						height: '60px',
					}}
				>
					<div>{footerLeft}</div>
					<div>{footerRight}</div>
				</div>
			</div>
		</div>
	);
};
