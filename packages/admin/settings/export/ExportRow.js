import { __ } from '@wordpress/i18n';

export default ({ title, model }) => {
	return (
		<sc-stacked-list-row style={{ '--columns': '2' }}>
			<strong style={{ padding: '10px 0px' }}>{title}</strong>
			<sc-button
				size="small"
				slot="suffix"
				href={`${scData?.app_url}/exports`}
				target="_blank"
			>
				<sc-icon name="download" slot="suffix"></sc-icon>
				{__('Export CSV', 'surecart')}
			</sc-button>
		</sc-stacked-list-row>
	);
};
