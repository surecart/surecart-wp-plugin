import { __ } from '@wordpress/i18n';

export default ({ title, description, model, action = 'notification' }) => {
	return (
		<sc-stacked-list-row style={{ '--columns': '3' }}>
			<strong>{title}</strong>
			<div style={{ opacity: '0.75' }}>{description}</div>
			<sc-button
				size="small"
				slot="suffix"
				href={`${scData?.app_url}/notification_templates/:customer_notifications/${model}/${action}/edit`}
				target="_blank"
			>
				{__('Edit', 'surecart')}
				<sc-icon
					name="external-link"
					slot="suffix"
					style={{ width: '12px', height: '12px' }}
				></sc-icon>
			</sc-button>
		</sc-stacked-list-row>
	);
};
