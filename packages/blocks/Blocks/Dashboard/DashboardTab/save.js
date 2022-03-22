export default ({ attributes }) => {
	const { icon, title } = attributes;
	return (
		<sc-tab slot="nav">
			<sc-icon
				style={{ 'font-size': '18px' }}
				slot="prefix"
				name={icon || 'home'}
			></sc-icon>
			{title}
		</sc-tab>
	);
};
