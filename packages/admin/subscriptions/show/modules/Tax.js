import { ScBlockUi, ScSwitch } from '@surecart/components-react';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { store as noticesStore } from '@wordpress/notices';
import Box from '../../../ui/Box';
import { store as coreStore } from '@wordpress/core-data';

export default ({ subscription, loading }) => {
	const [busy, setBusy] = useState();
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);
	const { editEntityRecord, saveEditedEntityRecord } = useDispatch(coreStore);

	const toggleTax = async (tax_enabled) => {
		try {
			setBusy(true);

			await editEntityRecord(
				'surecart',
				'subscription',
				subscription?.id,
				{
					tax_enabled,
				}
			);

			const record = await saveEditedEntityRecord(
				'surecart',
				'subscription',
				subscription?.id
			);

			createSuccessNotice(
				record?.tax_enabled
					? __('Tax enabled.', 'surecart')
					: __('Tax disabled.', 'surecart'),
				{ type: 'snackbar' }
			);
		} catch (e) {
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{ type: 'snackbar' }
			);
		} finally {
			setBusy(false);
		}
	};

	if (!scData?.tax_protocol?.tax_enabled) {
		return null;
	}

	return (
		<Box title={__('Tax', 'surecart')} loading={loading}>
			<ScSwitch
				checked={subscription?.tax_enabled}
				onScChange={(e) => toggleTax(e.target.checked)}
			>
				{__('Collect Tax', 'surecart')}
			</ScSwitch>
			{busy && <ScBlockUi spinner />}
		</Box>
	);
};
