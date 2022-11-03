import {
	ScAlert,
	ScIcon,
	ScInput,
	ScButton,
	ScText,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { useState } from 'react';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';

export default ({ url, checkoutId, promotionId }) => {
	const [copied, setCopied] = useState(false);
	const { createErrorNotice } = useDispatch(noticesStore);

	console.log({ promotionId });

	const link = addQueryArgs(
		`${(url || '').replace(/\/+$/, '')}/surecart/redirect`,
		{
			checkout_id: checkoutId,
			...(promotionId ? { promotion: promotionId } : {}),
		}
	);

	const copyLink = async () => {
		try {
			await navigator.clipboard.writeText(link);
			setCopied(true);
			setTimeout(() => {
				setCopied(false);
			}, 2000);
		} catch (err) {
			console.error(err);
			createErrorNotice(__('Error copying to clipboard', 'surecart'), {
				type: 'snackbar',
			});
		}
	};
	return (
		<ScAlert type="info" noIcon open={!!checkoutId}>
			<ScIcon name="shopping-cart" slot="icon" />
			<span slot="title">{__('Cart Recovery Link', 'surecart')}</span>
			<ScInput readonly value={link}>
				<ScButton
					type="default"
					size="small"
					slot="suffix"
					onClick={copyLink}
				>
					{copied
						? __('Copied!', 'surecart')
						: __('Copy', 'surecart')}
				</ScButton>
			</ScInput>
			<ScText
				style={{
					'line-height': 'var(--sc-line-height-dense)',
					'--color': 'var(--sc-color-gray-500)',
				}}
			>
				{__('To adjust your abandoned checkout notifications,')}{' '}
				<a href="#" style={{ color: 'var(--sc-color-gray-700)' }}>
					{__('adjust your settings', 'surecart')}
				</a>
				.
			</ScText>
		</ScAlert>
	);
};
