import { useEffect } from 'react';
import { __, _n, sprintf } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import { trash, copy, archive, edit, external } from '@wordpress/icons';
import {
	ConfirmActionModal,
	applyActionExtensions,
	iconLabel,
} from '../../../components/dataview-list';

/**
 * Bulk delete bridge — DataViews' action API only exposes a `RenderModal`
 * hook, so this 0-paint component dismisses the modal on mount and routes the
 * SPA to the bulk-delete view (which owns the Action-Scheduler pipeline).
 */
const NavigateToBulkDelete = ({ items, closeModal, navigation }) => {
	useEffect(() => {
		closeModal();
		navigation.goToBulkDelete(items.map((item) => item.id));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return null;
};

export const buildBundleActions = ({
	navigation,
	handleArchiveToggle,
	handleDuplicate,
	handleDelete,
}) => {
	const actions = [
		{
			id: 'edit',
			label: iconLabel(<Icon icon={edit} />, __('Edit', 'surecart')),
			icon: <Icon icon={edit} />,
			isPrimary: true,
			callback: ([item]) => navigation.goToEdit(item.id),
		},
		{
			id: 'archive',
			label: __('Archive', 'surecart'),
			icon: <Icon icon={archive} />,
			isEligible: (item) => !item.archived,
			supportsBulk: true,
			RenderModal: ({ items, closeModal }) => (
				<ConfirmActionModal
					items={items}
					closeModal={closeModal}
					onConfirm={handleArchiveToggle}
					confirmLabel={__('Archive', 'surecart')}
					isDestructive={false}
					message={sprintf(
						_n(
							'Archive %d bundle? Customers will no longer be able to purchase it.',
							'Archive %d bundles? Customers will no longer be able to purchase them.',
							items.length,
							'surecart'
						),
						items.length
					)}
				/>
			),
		},
		{
			id: 'unarchive',
			label: __('Un-Archive', 'surecart'),
			icon: <Icon icon={archive} />,
			isEligible: (item) => !!item.archived,
			supportsBulk: true,
			RenderModal: ({ items, closeModal }) => (
				<ConfirmActionModal
					items={items}
					closeModal={closeModal}
					onConfirm={handleArchiveToggle}
					confirmLabel={__('Un-archive', 'surecart')}
					isDestructive={false}
					message={sprintf(
						_n(
							'Un-archive %d bundle? It will become purchasable again.',
							'Un-archive %d bundles? They will become purchasable again.',
							items.length,
							'surecart'
						),
						items.length
					)}
				/>
			),
		},
		{
			id: 'view',
			label: iconLabel(
				<Icon icon={external} />,
				__('View Bundle', 'surecart')
			),
			isPrimary: true,
			icon: <Icon icon={external} />,
			isEligible: (item) => !!item.permalink,
			callback: ([item]) => window.open(item.permalink, '_blank'),
		},
		{
			id: 'duplicate',
			label: __('Duplicate', 'surecart'),
			icon: <Icon icon={copy} />,
			callback: ([item]) => handleDuplicate([item]),
		},
		{
			id: 'delete',
			icon: <Icon icon={trash} />,
			label: __('Delete permanently', 'surecart'),
			supportsBulk: true,
			RenderModal: ({ items, closeModal }) => {
				// Bulk → SPA route to the dedicated confirm view; single delete
				// keeps the inline confirm modal.
				if (items.length > 1) {
					return (
						<NavigateToBulkDelete
							items={items}
							closeModal={closeModal}
							navigation={navigation}
						/>
					);
				}
				return (
					<ConfirmActionModal
						items={items}
						closeModal={closeModal}
						onConfirm={handleDelete}
						confirmLabel={__('Delete', 'surecart')}
						isDestructive={true}
						message={sprintf(
							_n(
								'Are you sure you want to permanently delete %d bundle?',
								'Are you sure you want to permanently delete %d bundles?',
								items.length,
								'surecart'
							),
							items.length
						)}
					/>
				);
			},
		},
	];

	return applyActionExtensions('bundles', actions, { navigation });
};
