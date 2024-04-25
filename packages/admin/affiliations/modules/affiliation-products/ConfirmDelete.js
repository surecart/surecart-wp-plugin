/**
 * WordPress dependencies.
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies.
 */
import { ScBlockUi } from '@surecart/components-react';
import Error from '../../../components/Error';

export default ({ onRequestClose, open, affiliationProductId }) => {
	const [error, setError] = useState(null);
	const [deleting, setDeleting] = useState(false);
	const { deleteEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const onDelete = async () => {
		try {
			setDeleting(true);

			await deleteEntityRecord(
				'surecart',
				'affiliation-product',
				affiliationProductId,
				undefined,
				{
					throwOnError: true,
				}
			);

			createSuccessNotice(__('Affiliate product deleted.', 'surecart'), {
				type: 'snackbar',
			});

			onRequestClose();
		} catch (e) {
			setDeleting(false);
			setError(e);
		}
	};

	return (
		<ConfirmDialog
			isOpen={open}
			onConfirm={() => {
				onDelete();
			}}
			onCancel={onRequestClose}
		>
			<Error error={error} />
			{__('Are you sure? This action cannot be undone.', 'surecart')}
			{deleting && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					zIndex="9"
					spinner
				/>
			)}
		</ConfirmDialog>
	);
};
