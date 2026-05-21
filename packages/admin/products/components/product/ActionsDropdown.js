import { __, sprintf } from '@wordpress/i18n';
import {
	DropdownMenu,
	__experimentalConfirmDialog as ConfirmDialog,
	MenuItem,
} from '@wordpress/components';
import { moreHorizontal, inbox, trash, addCard } from '@wordpress/icons';
import { useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';

import DuplicateModel from '../DuplicateModel';
import useBundleLabels from '../../hooks/useBundleLabels';

export default ({
	product,
	onDelete,
	onToggleArchive,
	onSubmit,
	hasDirtyRecords,
}) => {
	const [modal, setModal] = useState(null);
	const [confirmMessage, setConfirmMessage] = useState(null);
	const labels = useBundleLabels(product);

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
									? labels.unarchiveLabel
									: labels.archiveLabel}
							</MenuItem>
						)}
						{!!onDelete && (
							<MenuItem
								icon={trash}
								iconPosition="left"
								onClick={() => setModal('delete')}
							>
								{labels.deleteLabel}
							</MenuItem>
						)}
						<DuplicateModel
							type="product"
							id={product?.id}
							onConfirm={hasDirtyRecords ? onSubmit : null}
							onSuccess={(duplicate) => {
								window.location.assign(
									addQueryArgs(labels.editIndexHref, {
										id: duplicate?.id,
									})
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
									{labels.duplicateLabel}
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
					product?.name || labels.entityLabel
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
							product?.name || labels.entityLabel
					  )
					: sprintf(
							__(
								'Archive %s? This product will not be purchaseable and all unsaved changes will be lost.',
								'surecart'
							),
							product?.name || labels.entityLabel
					  )}
			</ConfirmDialog>
		</>
	);
};
