import { __, _n, sprintf } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import { trash, edit, archive } from '@wordpress/icons';
import {
	ConfirmActionModal,
	applyActionExtensions,
	iconLabel,
} from '../../../components/dataview-list';

export const buildGroupActions = ({
	navigation,
	handleArchiveToggle,
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
			isEligible: (item) => !item?.archived,
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
							'Archive %d upgrade group?',
							'Archive %d upgrade groups?',
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
			isEligible: (item) => !!item?.archived,
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
							'Un-archive %d upgrade group?',
							'Un-archive %d upgrade groups?',
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
							'Are you sure you want to permanently delete %d upgrade group?',
							'Are you sure you want to permanently delete %d upgrade groups?',
							items.length,
							'surecart'
						),
						items.length
					)}
				/>
			),
		},
	];

	return applyActionExtensions('product-groups', actions, { navigation });
};
