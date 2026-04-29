import { useEffect } from 'react';
import { __, _n, sprintf } from '@wordpress/i18n';
import { Icon, Spinner } from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';
import { trash, copy, archive, edit, external } from '@wordpress/icons';
import {
	ConfirmActionModal,
	applyActionExtensions,
} from '../../../components/dataview-list';

// Hand bulk delete to the dedicated page — same route the PHP list
// table uses, with the Action-Scheduler-backed deletion + progress UI.
const buildBulkDeleteUrl = (items) => {
	return addQueryArgs('admin.php', {
		page: 'sc-products',
		action: 'delete',
		bulk_action_product_ids: items.map((item) => item.id),
	});
};

const BulkDeleteRedirect = ({ items, closeModal }) => {
	useEffect(() => {
		closeModal();
		window.location.href = buildBulkDeleteUrl(items);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 12,
				padding: 16,
			}}
		>
			<Spinner />
			<span>{__('Opening bulk delete page…', 'surecart')}</span>
		</div>
	);
};

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
			RenderModal: ({ items, closeModal }) => (
				<ConfirmActionModal
					items={items}
					closeModal={closeModal}
					onConfirm={handleArchiveToggle}
					confirmLabel={__('Archive', 'surecart')}
					isDestructive={false}
					message={sprintf(
						_n(
							'Archive %d product? Customers will no longer be able to purchase it.',
							'Archive %d products? Customers will no longer be able to purchase them.',
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
							'Un-archive %d product? It will become purchasable again.',
							'Un-archive %d products? They will become purchasable again.',
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
			RenderModal: ({ items, closeModal }) => {
				if (items.length > 1) {
					return (
						<BulkDeleteRedirect
							items={items}
							closeModal={closeModal}
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
								'Are you sure you want to permanently delete %d product?',
								'Are you sure you want to permanently delete %d products?',
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

	return applyActionExtensions('products', actions, { navigation });
};
