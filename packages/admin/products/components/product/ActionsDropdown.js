import { __, sprintf } from '@wordpress/i18n';
import {
	DropdownMenu,
	__experimentalConfirmDialog as ConfirmDialog,
} from '@wordpress/components';
import { moreHorizontal, inbox, trash } from '@wordpress/icons';
import { useState } from '@wordpress/element';

export default ({ product, onDelete, onToggleArchive }) => {
	const [modal, setModal] = useState(null);

	if (!product?.id) {
		return '';
	}

	return (
		<>
			<DropdownMenu
				controls={[
					...[
						!!onToggleArchive
							? {
									icon: inbox,
									onClick: () => setModal('archive'),
									title: product?.archived
										? __('Un-Archive Product', 'surecart')
										: __('Archive Product', 'surecart'),
							  }
							: {},
					],
					...[
						!!onDelete
							? {
									icon: trash,
									onClick: () => setModal('delete'),
									title: __('Delete Product', 'surecart'),
							  }
							: {},
					],
				]}
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
			/>

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
						'Permanently delete %s? You cannot undo this action.',
						'surecart'
					),
					product?.name || 'Product'
				)}
			</ConfirmDialog>

			<ConfirmDialog
				isOpen={modal === 'archive'}
				onConfirm={() => {
					setModal(null);
					onToggleArchive();
				}}
				onCancel={() => setModal(null)}
			>
				{product?.archived
					? sprintf(
							__(
								'Un-Archive %s? This will make the product purchaseable again.',
								'surecart'
							),
							product?.name || 'Product'
					  )
					: sprintf(
							__(
								'Archive %s? This product will not be purchaseable and all unsaved changes will be lost.',
								'surecart'
							),
							product?.name || 'Product'
					  )}
			</ConfirmDialog>
		</>
	);
};
