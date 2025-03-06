/** @jsx jsx */
import SettingsBox from '../SettingsBox';
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { ScButton, ScBlockUi } from '@surecart/components-react';
import apiFetch from '@wordpress/api-fetch';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import { Flex, Modal } from '@wordpress/components';

export default () => {
	const sureTriggers = scData?.integrations?.suretriggers || {};
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState(sureTriggers?.status);

	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);

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
	}, [open]);

	const installSureTriggers = async () => {
		const formData = new window.FormData();
		formData.append('action', 'surecart_plugin_install');
		formData.append('_ajax_nonce', scData?.plugin_installer_nonce);
		formData.append('slug', 'suretriggers');
		formData.append('init', 'suretriggers/suretriggers.php');

		try {
			setLoading(true);
			const response = await apiFetch({
				url: scData?.ajax_url,
				method: 'POST',
				body: formData,
			});
			console.log('response', response);
		} catch (error) {
			createErrorNotice(
				error?.message || __('Something went wrong', 'surecart'),
				{ type: 'snackbar' }
			);
		} finally {
			setLoading(false);
			setStatus('installed');
			createSuccessNotice(__('Plugin installed.', 'surecart'), {
				type: 'snackbar',
			});
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
			setLoading(true);
			const response = await apiFetch({
				url: scData?.ajax_url,
				method: 'POST',
				body: formData,
			});
			console.log('response', response);
		} catch (error) {
			createErrorNotice(
				error?.message || __('Something went wrong', 'surecart'),
				{ type: 'snackbar' }
			);
		} finally {
			setLoading(false);
			setStatus('activated');
			createSuccessNotice(__('Plugin activated.', 'surecart'), {
				type: 'snackbar',
			});
		}
	};

	const buttonText = () => {
		switch (status) {
			case 'install':
				return loading
					? __('Installing...', 'surecart')
					: __('Install & Activate', 'surecart');
			case 'installed':
				return loading
					? __('Activating...', 'surecart')
					: __('Activate', 'surecart');
			case 'configure':
				return __('Configure', 'surecart');
			case 'activated':
				return __('View Integrations', 'surecart');
			default:
				return '';
		}
	};

	const onClick = async () => {
		if (status === 'install') {
			await installSureTriggers();
			await activateSureTriggers();
		}
		if (status === 'installed') {
			await activateSureTriggers();
		}
		if (status === 'configure') {
			window.location.assign('admin.php?page=suretriggers');
		}
		if (status === 'activated') {
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
			<Flex justify="space-between" wrap="wrap" gap="20px">
				<div
					css={css`
						flex: 1 1 425px;
					`}
				>
					<Flex justify="flex-start">
						<img src={sureTriggers?.logo} alt="SureTriggers" />
						<img src={sureTriggers?.logoText} alt="SureTriggers" />
					</Flex>
					<p>
						{__(
							'SureTriggers lets you connect SureCart to hundreds of apps, CRMs and tools such as Slack, Mailchimp, etc. With this you have have various automations setup between SureCart events & other apps. Whatever you want SureCart & SureTriggers has got you covered.',
							'surecart'
						)}
					</p>
					<ScButton type="primary" onClick={onClick}>
						{buttonText()}
					</ScButton>
				</div>
				<div
					css={css`
						flex: 1 1 200px;
					`}
				>
					<img
						src={sureTriggers?.banner}
						alt="SureTriggers"
						width="100%"
						loading="lazy"
					/>
				</div>
			</Flex>
			{open && (
				<Modal
					isFullScreen
					onRequestClose={() => setOpen(false)}
					css={css`
						.components-modal__content {
							> div:not([class]) {
								display: flex;
								flex-direction: column;
								height: 100%;
							}
						}
					`}
				>
					<div
						style={{
							width: '100%',
							height: '100%',
						}}
						id="suretriggers-iframe-wrapper"
					></div>
				</Modal>
			)}
			{loading && <ScBlockUi spinner />}
		</SettingsBox>
	);
};
