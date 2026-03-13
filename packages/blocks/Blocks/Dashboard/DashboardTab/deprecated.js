const v1 = {
	attributes: {
		id: { type: 'string' },
		title: { type: 'string', default: 'Tab' },
		panel: { type: 'string', default: '' },
		icon: { type: 'string', default: 'home' },
		icon_svg: { type: 'string', default: '' },
	},
	save({ attributes }) {
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
	},
};
export default [v1];
