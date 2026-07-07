import { __, _n, sprintf } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import { trash, edit, check, closeSmall } from '@wordpress/icons';
import {
	ConfirmActionModal,
	applyActionExtensions,
	iconLabel,
} from '../../../components/dataview-list';

export const buildReviewActions = ({
	navigation,
	handleApprove,
	handleReject,
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
			// `isPrimary` so triaging pending reviews is one click, not buried in the menu.
			id: 'approve',
			label: iconLabel(<Icon icon={check} />, __('Approve', 'surecart')),
			icon: <Icon icon={check} />,
			isPrimary: true,
			isEligible: (item) => item?.status !== 'published',
			supportsBulk: true,
			RenderModal: ({ items, closeModal }) => (
				<ConfirmActionModal
					items={items}
					closeModal={closeModal}
					onConfirm={handleApprove}
					confirmLabel={__('Approve', 'surecart')}
					isDestructive={false}
					message={sprintf(
						_n(
							'Approve %d review? It will become publicly visible.',
							'Approve %d reviews? They will become publicly visible.',
							items.length,
							'surecart'
						),
						items.length
					)}
				/>
			),
		},
		{
			id: 'reject',
			label: iconLabel(<Icon icon={closeSmall} />, __('Reject', 'surecart')),
			icon: <Icon icon={closeSmall} />,
			isPrimary: true,
			isEligible: (item) => item?.status !== 'unpublished',
			supportsBulk: true,
			RenderModal: ({ items, closeModal }) => (
				<ConfirmActionModal
					items={items}
					closeModal={closeModal}
					onConfirm={handleReject}
					confirmLabel={__('Reject', 'surecart')}
					isDestructive={false}
					message={sprintf(
						_n(
							'Reject %d review? It will be hidden from customers.',
							'Reject %d reviews? They will be hidden from customers.',
							items.length,
							'surecart'
						),
						items.length
					)}
				/>
			),
		},
		{
			id: 'delete',
			icon: <Icon icon={trash} />,
			label: __('Delete permanently', 'surecart'),
			supportsBulk: true,
			RenderModal: ({ items, closeModal }) => (
				<ConfirmActionModal
					items={items}
					closeModal={closeModal}
					onConfirm={handleDelete}
					confirmLabel={__('Delete', 'surecart')}
					isDestructive={true}
					message={sprintf(
						_n(
							'Are you sure you want to permanently delete %d review?',
							'Are you sure you want to permanently delete %d reviews?',
							items.length,
							'surecart'
						),
						items.length
					)}
				/>
			),
		},
	];

	return applyActionExtensions('reviews', actions, { navigation });
};
