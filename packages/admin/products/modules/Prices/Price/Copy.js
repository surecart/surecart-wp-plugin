import { __ } from '@wordpress/i18n';
import { ScButton } from '@surecart/components-react';
import { useState } from 'react';

export default ({ url, className }) => {
	const [content, setContent] = useState('');
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setContent(__('Copied!', 'surecart'));
			setTimeout(() => {
				setContent('');
			}, 2000);
		} catch (err) {
			alert(__('Error copying to clipboard', 'surecart'));
		}
	};
	return (
		<ScButton className={className} size="small" onClick={copy}>
			{content || __('Copy Buy Link', 'surecart')}
		</ScButton>
	);
};
