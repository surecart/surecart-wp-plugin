import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import {
	Button,
	__experimentalText as Text,
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
} from '@wordpress/components';

export default function ConfirmDeleteModal({
	items,
	closeModal,
	onDelete,
	message,
}) {
	const [isBusy, setIsBusy] = useState(false);

	const handleConfirm = async () => {
		setIsBusy(true);
		try {
			await onDelete(items);
			closeModal();
		} catch (error) {
			// Keep modal open so the user can retry or cancel explicitly.
			// The caller is expected to surface the error via createErrorNotice.
		} finally {
			setIsBusy(false);
		}
	};

	return (
		<VStack>
			<Text>{message}</Text>
			<HStack justify="end">
				<Button
					variant="tertiary"
					onClick={closeModal}
					disabled={isBusy}
				>
					{__('Cancel', 'surecart')}
				</Button>
				<Button
					variant="primary"
					isDestructive
					isBusy={isBusy}
					disabled={isBusy}
					onClick={handleConfirm}
				>
					{__('Delete', 'surecart')}
				</Button>
			</HStack>
		</VStack>
	);
}
