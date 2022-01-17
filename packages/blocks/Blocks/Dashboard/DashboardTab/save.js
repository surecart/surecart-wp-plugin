export default ({ attributes }) => {
	const { icon, title } = attributes;
	return (
		<ce-tab slot="nav">
			<ce-icon
				style={{ 'font-size': '18px' }}
				slot="prefix"
				name={icon || 'home'}
			></ce-icon>
			{title}
		</ce-tab>
	);
};
