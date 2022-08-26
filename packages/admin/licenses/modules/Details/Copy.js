import { __ } from '@wordpress/i18n';
import { ScButton } from '@surecart/components-react';
import { useState } from 'react';

export default ({ text, className, slot }) => {
	const [content, setContent] = useState('');
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			setContent(__('Copied!', 'surecart'));
			setTimeout(() => {
				setContent('');
			}, 2000);
		} catch (err) {
			console.error(err);
			alert(__('Error copying to clipboard', 'surecart'));
		}
	};
	return (
		<ScButton slot={slot} className={className} size="small" onClick={copy}>
			{content || __('Copy', 'surecart')}
		</ScButton>
	);
};
