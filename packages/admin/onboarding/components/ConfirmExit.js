import { useEffect } from 'react';
import { __ } from '@wordpress/i18n';

function ConfirmExit() {
	useEffect(() => {
		const onUnload = (e) => {
			e.preventDefault();
			e.returnValue = '';
			const confirmationMessage = __(
				'Are you sure you want to leave this page?',
				'surecart'
			);
			e.returnValue = confirmationMessage;
			return confirmationMessage;
		};

		window.addEventListener('beforeunload', onUnload);

		return () => {
			window.removeEventListener('beforeunload', onUnload);
		};
	}, []);

	return null;
}

export default ConfirmExit;
