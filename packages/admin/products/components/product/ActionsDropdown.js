import { __, sprintf } from '@wordpress/i18n';
import {
	DropdownMenu,
	__experimentalConfirmDialog as ConfirmDialog,
	MenuItem,
} from '@wordpress/components';
import { moreHorizontal, inbox, trash, addCard } from '@wordpress/icons';
import { useState } from '@wordpress/element';
import DuplicateModel from '../DuplicateModel';
import { addQueryArgs } from '@wordpress/url';

export default ({
	product,
	onDelete,
	onToggleArchive,
	onSubmit,
	hasDirtyRecords,
}) => {
	const [modal, setModal] = useState(null);
	const [confirmMessage, setConfirmMessage] = useState(null);

	if (!product?.id) {
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
						{!!onToggleArchive && (
							<MenuItem
								icon={inbox}
								iconPosition="left"
								onClick={() => setModal('archive')}
							>
								{product?.archived
									? __('Un-Archive Product', 'surecart')
									: __('Archive Product', 'surecart')}
							</MenuItem>
						)}
						{!!onDelete && (
							<MenuItem
								icon={trash}
								iconPosition="left"
								onClick={() => setModal('delete')}
							>
								{__('Delete Product', 'surecart')}
							</MenuItem>
						)}
						<DuplicateModel
							type="product"
							id={product?.id}
							onConfirm={hasDirtyRecords ? onSubmit : null}
							onSuccess={(duplicate) => {
								window.location.assign(
									addQueryArgs(
										'admin.php?page=sc-products&action=edit',
										{
											id: duplicate?.id,
										}
									)
								);
							}}
							message={confirmMessage}
						>
							{({ onClick }) => (
								<MenuItem
									icon={addCard}
									onClick={() => {
										setConfirmMessage(
											hasDirtyRecords
												? __(
														'Are you sure you wish to duplicate? This will save any unsaved changes.',
														'surecart'
												  )
												: __(
														'Are you sure you wish to duplicate?',
														'surecart'
												  )
										);

										onClick();
									}}
									iconPosition="left"
								>
									{__('Duplicate Product', 'surecart')}
								</MenuItem>
							)}
						</DuplicateModel>
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
