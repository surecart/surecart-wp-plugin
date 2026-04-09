import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import {
	Button,
	__experimentalText as Text,
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
} from '@wordpress/components';

/**
 * ConfirmDeleteModal — Reusable delete confirmation modal with built-in busy state.
 *
 * Handles the async delete flow: shows a spinner on the Delete button, disables
 * both buttons while the operation is in-flight, then calls closeModal() only
 * after the promise resolves or rejects.
 *
 * @example
 * RenderModal: ({ items, closeModal }) => (
 *   <ConfirmDeleteModal
 *     items={items}
 *     closeModal={closeModal}
 *     onDelete={handleDelete}
 *     message={sprintf(
 *       _n(
 *         'Are you sure you want to permanently delete %d item?',
 *         'Are you sure you want to permanently delete %d items?',
 *         items.length,
 *         'surecart'
 *       ),
 *       items.length
 *     )}
 *   />
 * )
 *
 * @param {Object}   props
 * @param {Array}    props.items        - Items to delete (forwarded to onDelete).
 * @param {Function} props.closeModal   - Called by DataViews to close the modal.
 * @param {Function} props.onDelete     - Async function (items) => Promise. Should throw on failure.
 * @param {string}   props.message      - Confirmation message rendered above the buttons.
 */
export default function ConfirmDeleteModal( { items, closeModal, onDelete, message } ) {
	const [ isBusy, setIsBusy ] = useState( false );

	const handleConfirm = async () => {
		setIsBusy( true );
		try {
			await onDelete( items );
		} finally {
			setIsBusy( false );
			closeModal();
		}
	};

	return (
		<VStack>
			<Text>{ message }</Text>
			<HStack justify="end">
				<Button variant="tertiary" onClick={ closeModal } disabled={ isBusy }>
					{ __( 'Cancel', 'surecart' ) }
				</Button>
				<Button
					variant="primary"
					isDestructive
					isBusy={ isBusy }
					disabled={ isBusy }
					onClick={ handleConfirm }
				>
					{ __( 'Delete', 'surecart' ) }
				</Button>
			</HStack>
		</VStack>
	);
}
