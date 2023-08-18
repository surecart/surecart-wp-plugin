/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { Modal } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import { ScAlert, ScButton, ScFlex } from '@surecart/components-react';

export default ({ deleteItem, deletingItem, setError, onClose = () => {} }) => {
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { deleteEntityRecord } = useDispatch(coreStore);

	/**
	 * Handle the delete action.
	 */
	const deleteCollection = async () => {
		try {
			await deleteEntityRecord(
				'surecart',
				'product-collection',
				deleteItem?.id
			);
			createSuccessNotice(__('Product collection deleted.', 'surecart'), {
				type: 'snackbar',
			});
			window.location.assign('admin.php?page=sc-product-collections');
		} catch (e) {
			console.error(e?.message);
			setError(e);
		}
	};

	return (
		<Modal
			title={__('Delete this product collection?', 'surecart')}
			css={css`
				max-width: 500px !important;
			`}
			onRequestClose={onClose}
			shouldCloseOnClickOutside={false}
		>
			<p>
				{__(
					'Are you sure you want to delete this product collection?',
					'surecart'
				)}{' '}
				{__('This action cannot be undone.', 'surecart')}
			</p>
			<ScAlert
				type="warning"
				open
				css={css`
					margin-top: 10px;
					margin-bottom: 10px;
				`}
			>
				{__(
					"If you delete a product collection, the products inside that collection won't go away.",
					'surecart'
				)}{' '}
				{__(
					'They will just be taken out of the collection.',
					'surecart'
				)}
			</ScAlert>
			<ScFlex alignItems="center" justifyContent="flex-start">
				<ScButton
					type="primary"
					busy={deletingItem}
					onClick={deleteCollection}
				>
					{__('Delete', 'surecart')}
				</ScButton>
				<ScButton type="text" onClick={onClose}>
					{__('Cancel', 'surecart')}
				</ScButton>
			</ScFlex>
		</Modal>
	);
};
