/** @jsx jsx */
import { __, _n, sprintf } from '@wordpress/i18n';
import { jsx } from '@emotion/react';
import { Icon } from '@wordpress/components';
import { trash, edit, external } from '@wordpress/icons';
import {
	ConfirmDeleteModal,
	applyActionExtensions,
} from '../../../components/dataview-list';

export const buildCollectionActions = ({ navigation, handleDelete }) => {
	const actions = [
		{
			id: 'edit',
			label: __('Edit', 'surecart'),
			icon: <Icon icon={edit} />,
			isPrimary: true,
			callback: ([item]) => navigation.goToEdit(item.id),
		},
		{
			id: 'view',
			label: __('View Collection', 'surecart'),
			icon: <Icon icon={external} />,
			isPrimary: true,
			isEligible: (item) => !!item.permalink,
			callback: ([item]) => window.open(item.permalink, '_blank'),
		},
		{
			id: 'delete',
			icon: <Icon icon={trash} />,
			label: __('Delete permanently', 'surecart'),
			isDestructive: true,
			supportsBulk: true,
			RenderModal: ({ items, closeModal }) => (
				<ConfirmDeleteModal
					items={items}
					closeModal={closeModal}
					onDelete={handleDelete}
					message={sprintf(
						_n(
							'Are you sure you want to permanently delete %d collection?',
							'Are you sure you want to permanently delete %d collections?',
							items.length,
							'surecart'
						),
						items.length
					)}
				/>
			),
		},
	];

	return applyActionExtensions('product-collections', actions, { navigation });
};
