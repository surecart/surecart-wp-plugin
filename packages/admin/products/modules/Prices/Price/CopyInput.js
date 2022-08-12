import { __ } from '@wordpress/i18n';
import { ScButton, ScIcon, ScInput } from '@surecart/components-react';
import useSnackbar from '../../../../hooks/useSnackbar';

export default ({ label, text }) => {
	const { addSnackbarNotice } = useSnackbar();
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			addSnackbarNotice({
				content: __('Copied to clipboard.', 'surecart'),
			});
		} catch (err) {
			console.error(err);
			addSnackbarNotice({
				content: __('Error copying to clipboard', 'surecart'),
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
			<ScButton slot="suffix" size="small" onClick={copy}>
				<ScIcon name="clipboard" slot="prefix" />
				{__('Copy', 'surecart')}
			</ScButton>
		</ScInput>
	);
};
