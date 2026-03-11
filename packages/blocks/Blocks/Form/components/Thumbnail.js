export default ({ label, children, selected, onSelect }) => {
	return (
		<>
			<style>{`
				.sc-thumbnail-editor {
					flex: 1;
					display: flex;
					align-items: center;
					overflow: hidden;
					border-radius: 2px;
					border: 1px solid #f0f0f0;
					height: inherit;
					min-height: 300px;
					max-height: 700px;
					cursor: pointer;
				}
				.sc-thumbnail-editor:hover {
					border-color: var(--wp-admin-theme-color);
				}
				.sc-thumbnail-editor:focus,
				.sc-thumbnail-editor:active {
					box-shadow: inset 0 0 0 1px #fff,
						0 0 0 var(--wp-admin-border-width-focus)
							var(--wp-admin-theme-color);
					outline: 2px solid transparent;
				}
				.sc-thumbnail-editor--selected {
					box-shadow: inset 0 0 0 1px #fff,
						0 0 0 var(--wp-admin-border-width-focus) var(--wp-admin-theme-color);
					outline: 2px solid transparent;
				}
			`}</style>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
				}}
				onClick={onSelect}
			>
				<div
					className={`sc-thumbnail-editor${
						selected ? ' sc-thumbnail-editor--selected' : ''
					}`}
				>
					{children}
				</div>
				<div
					style={{
						paddingTop: '8px',
						fontSize: '16px',
						textAlign: 'center',
					}}
				>
					{label}
				</div>
			</div>
		</>
	);
};
