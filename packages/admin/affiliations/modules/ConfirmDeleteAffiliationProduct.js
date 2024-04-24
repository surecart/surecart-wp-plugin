/**
 * WordPress dependencies.
 */
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { select, useDispatch } from '@wordpress/data';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies.
 */
import { ScBlockUi } from '@surecart/components-react';
import Error from '../../components/Error';

export default ({
	onRequestClose,
	open,
	affiliationId,
	affiliationProductId,
	onRefresh,
}) => {
	const [error, setError] = useState(null);
	const [deleting, setDeleting] = useState(false);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	const onDelete = async () => {
		try {
			setDeleting(true);

			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'affiliation-product'
			);

			const { deleted } = await apiFetch({
				path: `${baseURL}/${affiliationProductId}`,
				method: 'DELETE',
			});
			console.log('deleted', deleted);

			if (deleted) {
				// receiveEntityRecords('surecart', 'affiliation-product', {
				// 	affiliation_ids: [affiliationId],
				// });
				createSuccessNotice(
					__(
						'Affiliation product has been deleted successfully.',
						'surecart'
					)
				);

				window.location.reload();
			}

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
