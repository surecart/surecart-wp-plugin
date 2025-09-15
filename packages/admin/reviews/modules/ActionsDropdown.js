import { __, sprintf } from '@wordpress/i18n';
import {
	DropdownMenu,
	__experimentalConfirmDialog as ConfirmDialog,
	MenuItem,
} from '@wordpress/components';
import { moreHorizontal, trash } from '@wordpress/icons';
import { useState } from '@wordpress/element';

export default ({ review, onDelete }) => {
	const [modal, setModal] = useState(null);

	if (!review?.id) {
		return '';
	}

	return (
		<>
			<DropdownMenu
				icon={moreHorizontal}
				label={__('More Actions', 'surecart')}
				popoverProps={{
					placement: 'bottom-end',
				}}
				menuProps={{
					style: {
						minWidth: '150px',
					},
				}}
			>
				{() => (
					<>
						{!!onDelete && (
							<MenuItem
								icon={trash}
								iconPosition="left"
								onClick={() => setModal('delete')}
							>
								{__('Delete Review', 'surecart')}
							</MenuItem>
						)}
					</>
				)}
			</DropdownMenu>
			<ConfirmDialog
				isOpen={modal === 'delete'}
				onConfirm={() => {
					onDelete();
					setModal(null);
				}}
				onCancel={() => setModal(null)}
			>
				{sprintf(
					__(
						'Permanently delete this review? You cannot undo this action.',
						'surecart'
					)
				)}
			</ConfirmDialog>
		</>
	);
};
