import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import apiFetch from '@wordpress/api-fetch';
import { ScButton } from '@surecart/components-react';
import { useEffect } from 'react';

export default ({
	plugin,
	slug,
	status: currentStatus = 'install',
	onActivated,
}) => {
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);
	const [status, setStatus] = useState(currentStatus);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setStatus(currentStatus);
	}, [currentStatus]);

	useEffect(() => {
		if (status === 'activated') {
			onActivated?.();
		}
	}, [status]);

	const install = async () => {
		const formData = new window.FormData();
		formData.append('action', 'surecart_plugin_install');
		formData.append('_ajax_nonce', scData?.plugin_installer_nonce);
		formData.append('slug', slug);
		formData.append('init', plugin);

		try {
			setLoading(true);
			const response = await apiFetch({
				url: scData?.ajax_url,
				method: 'POST',
				body: formData,
			});
			if (!response?.success) {
				throw new Error(__('Could not install plugin.', 'surecart'));
			}
			setStatus('installed');
		} catch (error) {
			createErrorNotice(
				error?.message || __('Something went wrong', 'surecart')
			);
		} finally {
			setLoading(false);
			createSuccessNotice(__('Plugin installed.', 'surecart'));
		}
	};

	const activate = async () => {
		const formData = new window.FormData();
		formData.append('action', 'surecart_plugin_activate');
		formData.append('_ajax_nonce', scData?.plugin_installer_nonce);
		formData.append('plugin', plugin);
		formData.append('name', slug);
		formData.append('slug', slug);

		try {
			setLoading(true);
			const response = await apiFetch({
				url: scData?.ajax_url,
				method: 'POST',
				body: formData,
			});
			if (!response?.success) {
				throw new Error({
					message: __('Could not activate plugin.', 'surecart'),
				});
			}
			setStatus('activated');
		} catch (error) {
			createErrorNotice(
				error?.message || __('Something went wrong', 'surecart')
			);
		} finally {
			setLoading(false);
			createSuccessNotice(__('Plugin activated.', 'surecart'));
		}
	};

	const onClick = async () => {
		if (status === 'install') {
			await install();
			await activate();
		}
		if (status === 'installed') {
			await activate();
		}
		if (status === 'configure') {
			window.location.assign('admin.php?page=suretriggers');
		}
		if (status === 'activated') {
			setOpen(true);
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
				return __('Installed', 'surecart');
			default:
				return '';
		}
	};

	return (
		<ScButton
			type={status === 'activated' ? 'text' : 'primary'}
			onClick={onClick}
		>
			{buttonText()}
		</ScButton>
	);
};
