export default ({ label, children, selected, onSelect }) => {
	return (
		<>
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
