import SettingsBox from '../SettingsBox';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { ScButton, ScDialog } from '@surecart/components-react';

export default () => {
	const [open, setOpen] = useState(false);
	useEffect(() => {
		if (window?.SureTriggers) {
			window.SureTriggers.init({
				st_embed_url: 'https://app.suretriggers.com/embed-login',
				client_id: '07eba731-9491-4887-a0ef-6bb688b3f7ca',
				embedded_identifier: 'surecart-suretriggers-integration',
				target: 'suretriggers-iframe-wrapper',
				integration: 'SureCart',
				integration_display_name: 'SureCart',
				event: {
					value: 'order.created',
					label: 'Order Created',
					description: 'Runs when an order is placed.',
				},
				summary: 'Create new workflow',
				configure_trigger: true,
				show_recipes: true,
				style: {
					button: {
						background: '#01824c',
					},
					icon: {
						color: '#ffffff',
					},
				},
			});
		}
	}, []);

	return (
		<SettingsBox
			title={__('Integrations via SureTriggers', 'surecart')}
			description={__(
				'Boost your sales by automating customer actions & streamlining workflows with seamless SureCart and SureTriggers integration.',
				'surecart'
			)}
			noButton
		>
			<ScButton
				onClick={() => {
					setOpen(true);
				}}
			>
				{__('View Integrations', 'surecart')}
			</ScButton>
			<ScDialog
				open={open}
				style={{ '--dialog-body-overflow': 'visible' }}
				onScRequestClose={() => setOpen(false)}
			>
				<div id="suretriggers-iframe-wrapper"></div>
			</ScDialog>
		</SettingsBox>
	);
};
