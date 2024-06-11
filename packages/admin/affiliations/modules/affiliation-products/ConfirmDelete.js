/**
 * WordPress dependencies.
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies.
 */
import Confirm from '../../../components/confirm';

export default ({ onRequestClose, open, affiliationProductId, onDeleted }) => {
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

			onDeleted();
		} catch (e) {
			setError(e);
			console.error(e);
		} finally {
			setDeleting(false);
		}
	};

	return (
		<Confirm
			open={open}
			onRequestClose={onRequestClose}
			error={error}
			loading={deleting}
			onConfirm={onDelete}
		>
			{__('Are you sure? This cannot be undone.', 'surecart')}
		</Confirm>
	);
};
