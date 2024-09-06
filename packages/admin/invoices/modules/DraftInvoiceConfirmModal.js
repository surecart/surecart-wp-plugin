/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import Error from '../../components/Error';
import { ScBlockUi } from '@surecart/components-react';
import { useInvoice } from '../hooks/useInvoice';

export default ({ onRequestClose, open }) => {
	const { invoice, busy, draftInvoice, error } = useInvoice();
	if (!invoice?.id) {
		return null;
	}

	return (
		<ConfirmDialog
			isOpen={open}
			onConfirm={async () => {
				const data = await draftInvoice();
				if (!!data) {
					onRequestClose();
				}
			}}
			onCancel={onRequestClose}
		>
			<Error error={error} />

			{__(
				'Are you sure you want to change the status of this invoice to draft?',
				'surecart'
			)}
			{busy && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					zIndex="9"
					spinner
				/>
			)}
		</ConfirmDialog>
	);
};
