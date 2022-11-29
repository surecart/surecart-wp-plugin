import { __ } from '@wordpress/i18n';

export default ({ title, description, link = 'customer_notifications', model, action = 'notification', disabled = false }) => {
	return (
		<sc-stacked-list-row style={{ '--columns': '3' }}>
			<strong>
				{title}
				{ disabled && (
					<sc-upgrade-required style={{ marginLeft: '5px' }} type="success" size="small" pill />
				)}
			</strong>
			<div style={{ opacity: '0.75' }}>{description}</div>
			<sc-button
				size="small"
				slot="suffix"
				href={disabled ? `#` : `${scData?.app_url}/notification_templates/:${link}/${model}/${action}/edit`}
				target="_blank"
				disabled={disabled}
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
