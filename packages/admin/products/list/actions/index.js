/** @jsx jsx */
import { __, _n, sprintf } from '@wordpress/i18n';
import { jsx } from '@emotion/react';
import { Icon } from '@wordpress/components';
import { trash, copy, archive, edit, external } from '@wordpress/icons';
import {
	ConfirmDeleteModal,
	applyActionExtensions,
} from '../../../components/dataview-list';

/**
 * Build the actions list for the products dataview.
 *
 * Each handler is provided by the screen — the handlers know about state
 * (`isMutating`, notices, invalidation). This module just composes the
 * action shape.
 *
 * Plugins can register extra actions via
 * `surecart.dataview.products.actions`.
 */
export const buildProductActions = ({
	navigation,
	handleArchiveToggle,
	handleDuplicate,
	handleDelete,
}) => {
	const actions = [
		{
			id: 'edit',
			label: __('Edit', 'surecart'),
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
			callback: (items) => handleArchiveToggle(items),
		},
		{
			id: 'unarchive',
			label: __('Un-Archive', 'surecart'),
			icon: <Icon icon={archive} />,
			isEligible: (item) => !!item.archived,
			supportsBulk: true,
			callback: (items) => handleArchiveToggle(items),
		},
		{
			id: 'view',
			label: __('View Product', 'surecart'),
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
			isDestructive: true,
			supportsBulk: true,
			RenderModal: ({ items, closeModal }) => (
				<ConfirmDeleteModal
					items={items}
					closeModal={closeModal}
					onDelete={handleDelete}
					message={sprintf(
						_n(
							'Are you sure you want to permanently delete %d product?',
							'Are you sure you want to permanently delete %d products?',
							items.length,
							'surecart'
						),
						items.length
					)}
				/>
			),
		},
	];

	return applyActionExtensions('products', actions, {
		navigation,
	});
};
