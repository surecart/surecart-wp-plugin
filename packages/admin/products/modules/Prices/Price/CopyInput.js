import useSnackbar from '../../../../hooks/useSnackbar';
import { ScButton, ScIcon, ScInput } from '@surecart/components-react';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

export default ({ label, text }) => {
	const { addSnackbarNotice } = useSnackbar();
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			createSuccessNotice(__('Copied to clipboard.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (err) {
			console.error(err);
			createErrorNotice(__('Error copying to clipboard.', 'surecart'), {
				type: 'snackbar',
			});
		}
	};
	return (
		<ScInput
			style={{ '--sc-input-background-color': 'var(--sc-color-gray-100' }}
			label={label}
			readonly
			value={text}
		>
      {location.protocol === 'https:' && (
				<ScButton slot="suffix" size="small" onClick={copy}>
					<ScIcon name="clipboard" slot="prefix" />
					{__('Copy', 'surecart')}
				</ScButton>
			)}
		</ScInput>
	);
};
