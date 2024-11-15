import SettingsBox from '../SettingsBox';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { ScButton, ScDialog } from '@surecart/components-react';
import apiFetch from '@wordpress/api-fetch';

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

	const installSureTriggers = async () => {
		const formData = new window.FormData();
		formData.append('action', 'surecart_plugin_install');
		formData.append('_ajax_nonce', scData?.plugin_installer_nonce);
		formData.append('slug', 'suretriggers');
		formData.append('init', 'suretriggers/suretriggers.php');

		try {
			const response = await apiFetch({
				url: scData?.ajax_url,
				method: 'POST',
				body: formData,
			});
			console.log('response', response);
		} catch (error) {
			console.error('Error installing plugin:', error);
		}
	};

	const activateSureTriggers = async () => {
		const formData = new window.FormData();
		formData.append('action', 'surecart_plugin_activate');
		formData.append('_ajax_nonce', scData?.plugin_installer_nonce);
		formData.append('plugin', 'suretriggers/suretriggers.php');
		formData.append('name', 'suretriggers');
		formData.append('slug', 'suretriggers');

		try {
			const response = await apiFetch({
				url: scData?.ajax_url,
				method: 'POST',
				body: formData,
			});
			console.log('response', response);
		} catch (error) {
			console.error('Error activating plugin:', error);
		}
	};

	const buttonText = () => {
		if (scData?.integrations?.suretriggers?.status === 'install') {
			return __('Install', 'surecart');
		}
		if (scData?.integrations?.suretriggers?.status === 'installed') {
			return __('Activate', 'surecart');
		}
		if (scData?.integrations?.suretriggers?.status === 'configure') {
			return __('Configure', 'surecart');
		}
		if (scData?.integrations?.suretriggers?.status === 'activated') {
			return __('View Integrations', 'surecart');
		}
	};

	const onClick = async () => {
		if (scData?.integrations?.suretriggers?.status === 'install') {
			await installSureTriggers();
		}
		if (scData?.integrations?.suretriggers?.status === 'installed') {
			await activateSureTriggers();
		}
		if (scData?.integrations?.suretriggers?.status === 'configure') {
			window.location.assign('admin.php?page=suretriggers');
		}
		if (scData?.integrations?.suretriggers?.status === 'activated') {
			setOpen(true);
		}
	};
	return (
		<SettingsBox
			title={__('Integrations via SureTriggers', 'surecart')}
			description={__(
				'Boost your sales by automating customer actions & streamlining workflows with seamless SureCart and SureTriggers integration.',
				'surecart'
			)}
			noButton
		>
			<ScButton onClick={() => onClick()}>{buttonText()}</ScButton>

			<ScDialog
				open={open}
				style={{
					'--dialog-body-overflow': 'visible',
					'--width': '65rem',
					'--height': '40rem',
				}}
				onScRequestClose={() => setOpen(false)}
				noHeader
				id="suretriggers-iframe-wrapper"
			/>
		</SettingsBox>
	);
};
