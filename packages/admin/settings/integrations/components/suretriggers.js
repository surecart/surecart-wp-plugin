import { useEffect } from 'react';

export default ({ record }) => {
	useEffect(() => {
		if (!record?.is_enabled) {
			return;
		}

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
	}, [record]);

	return (
		record?.is_enabled && (
			<div
				style={{
					width: '100%',
					height: '100%',
					minHeight: '800px',
				}}
				id="suretriggers-iframe-wrapper"
			></div>
		)
	);
};
