/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import { ScBlockUi } from '@surecart/components-react';
import { useInvoice } from '../hooks/useInvoice';
import Error from '../../components/Error';

export default ({ open, onRequestClose }) => {
	const { loading, busy, error, markAsPaid } = useInvoice();

	return (
		<ConfirmDialog
			isOpen={open}
			onConfirm={async () => {
				const paid = await markAsPaid();
				if (!!paid) {
					onRequestClose();
				}
			}}
			onCancel={onRequestClose}
			confirmButtonText={__('Mark Paid', 'surecart')}
		>
			<Error error={error} />

			{__(
				'Are you sure you wish to mark the invoice as paid?',
				'surecart'
			)}

			{loading ||
				(busy && (
					<ScBlockUi
						style={{ '--sc-block-ui-opacity': '0.75' }}
						spinner
					/>
				))}
		</ConfirmDialog>
	);
};
