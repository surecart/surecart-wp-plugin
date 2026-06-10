import { useEffect } from 'react';
import { __, _n, sprintf } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import { trash, copy, archive, edit, external } from '@wordpress/icons';
import {
	ConfirmActionModal,
	applyActionExtensions,
	iconLabel,
} from '../../../components/dataview-list';
import {
	isVariantRow,
	getVariantParent,
	getVariantOriginalId,
	productOnlyItems,
} from '../variants';

// Compose each product action's `isEligible` against this so we don't
// scatter `!isVariantRow` checks throughout the file.
const productOnly = (extra) => (item) =>
	!isVariantRow(item) && (extra ? extra(item) : true);

/**
 * Bulk delete bridge — DataViews' action API only gives us a `RenderModal`
 * hook, so we render a 0-paint component that, on mount, dismisses the modal
 * and navigates the SPA to the bulk-delete route. No spinner: the SPA
 * transition is instant and the receiving view shows its own loading state.
 */
const NavigateToBulkDelete = ({ items, closeModal, navigation }) => {
	useEffect(() => {
		closeModal();
		const products = productOnlyItems(items);
		navigation.goToBulkDelete(products.map((item) => item.id));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return null;
};

export const buildProductActions = ({
	navigation,
	handleArchiveToggle,
	handleDuplicate,
	handleDelete,
	handleDeleteVariant,
	onEditVariant,
}) => {
	const actions = [
		{
			id: 'edit',
			label: iconLabel(<Icon icon={edit} />, __('Edit', 'surecart')),
			icon: <Icon icon={edit} />,
			isPrimary: true,
			isEligible: productOnly(),
			callback: ([item]) => navigation.goToEdit(item.id),
		},
		{
			id: 'editVariant',
			label: iconLabel(<Icon icon={edit} />, __('Edit variant', 'surecart')),
			icon: <Icon icon={edit} />,
			isPrimary: true,
			// Requires a real variant id — excludes the lazy-load placeholder rows.
			isEligible: (item) => isVariantRow(item) && !!getVariantOriginalId(item),
			callback: ([item]) => {
				const parent = getVariantParent(item);
				const variantId = getVariantOriginalId(item);
				if (!parent?.id || !variantId) return;
				onEditVariant?.({ productId: parent.id, variantId });
			},
		},
		{
			id: 'deleteVariant',
			label: __('Delete variant', 'surecart'),
			icon: <Icon icon={trash} />,
			isEligible: (item) => isVariantRow(item) && !!getVariantOriginalId(item),
			// Soft delete (status: 'draft') — same pattern as the
			// in-product VariantItem menu. Drafts are filtered out of
			// the list, so the row disappears; restore from the
			// product edit page.
			RenderModal: ({ items, closeModal }) => {
				const item = items[0];
				const parent = getVariantParent(item);
				const variantId = getVariantOriginalId(item);
				const label = [item?.option_1, item?.option_2, item?.option_3]
					.filter(Boolean)
					.join(' / ');
				return (
					<ConfirmActionModal
						items={items}
						closeModal={closeModal}
						onConfirm={() =>
							handleDeleteVariant?.({
								productId: parent?.id,
								variantId,
							})
						}
						confirmLabel={__('Delete', 'surecart')}
						isDestructive={true}
						message={sprintf(
							/* translators: %s is the variant label, e.g. "LG / Gray". */
							__(
								'Delete the %s variant? It will no longer be available for purchase. You can restore it later from the product edit page.',
								'surecart'
							),
							label || __('selected', 'surecart')
						)}
					/>
				);
			},
		},
		{
			id: 'archive',
			label: __('Archive', 'surecart'),
			icon: <Icon icon={archive} />,
			isEligible: productOnly((item) => !item.archived),
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
			isEligible: productOnly((item) => !!item.archived),
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
			label: iconLabel(
				<Icon icon={external} />,
				__('View Product', 'surecart')
			),
			isPrimary: true,
			icon: <Icon icon={external} />,
			isEligible: productOnly((item) => !!item.permalink),
			callback: ([item]) => window.open(item.permalink, '_blank'),
		},
		{
			id: 'duplicate',
			label: __('Duplicate', 'surecart'),
			icon: <Icon icon={copy} />,
			isEligible: productOnly(),
			callback: ([item]) => handleDuplicate([item]),
		},
		{
			id: 'delete',
			icon: <Icon icon={trash} />,
			label: __('Delete permanently', 'surecart'),
			isEligible: productOnly(),
			supportsBulk: true,
			RenderModal: ({ items, closeModal }) => {
				// Bulk delete → SPA route to the dedicated confirm view (which
				// owns the Action-Scheduler pipeline). Single delete keeps the
				// inline confirm modal — no need to route away for one row.
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
