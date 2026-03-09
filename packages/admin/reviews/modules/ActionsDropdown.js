import { __, sprintf } from '@wordpress/i18n';
import {
	DropdownMenu,
	__experimentalConfirmDialog as ConfirmDialog,
	MenuItem,
} from '@wordpress/components';
import { moreHorizontal, trash, unseen } from '@wordpress/icons';
import { useState } from '@wordpress/element';

export default ({ review, onDelete, onUnpublish }) => {
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
						{!!onUnpublish && (
							<MenuItem
								icon={unseen}
								iconPosition="left"
								onClick={() => setModal('unpublish')}
							>
								{__('Reject Review', 'surecart')}
							</MenuItem>
						)}

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
				isOpen={'unpublish' === modal}
				onConfirm={() => {
					onUnpublish();
					setModal(false);
				}}
				onCancel={() => setModal(false)}
			>
				{__(
					'Are you sure you want to reject this review?',
					'surecart'
				)}
			</ConfirmDialog>

			<ConfirmDialog
				isOpen={'delete' === modal}
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
