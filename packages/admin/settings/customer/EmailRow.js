import { __ } from '@wordpress/i18n';
import {
	ScButton,
	ScIcon,
	ScStackedListRow,
	ScUpgradeRequired,
} from '@surecart/components-react';

export default ({
	title,
	description,
	link = 'customer_notifications',
	model,
	action = 'notification',
	disabled = false,
}) => {
	return (
		<ScStackedListRow style={{ '--columns': '3' }}>
			<strong>
				{title}
				{disabled && (
					<ScUpgradeRequired style={{ marginLeft: '5px' }} />
				)}
			</strong>
			<div style={{ opacity: '0.75' }}>{description}</div>
			<ScButton
				size="small"
				slot="suffix"
				href={
					disabled
						? `#`
						: `${scData?.app_url}/notification_templates/:${link}/${model}/${action}/edit`
				}
				target="_blank"
				disabled={disabled}
			>
				{__('Edit', 'surecart')}
				<ScIcon
					name="external-link"
					slot="suffix"
					style={{ width: '12px', height: '12px' }}
				/>
			</ScButton>
		</ScStackedListRow>
	);
};
