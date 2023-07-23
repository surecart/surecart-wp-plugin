/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	ScButton,
	ScDropdown,
	ScFlex,
	ScIcon,
	ScInput,
	ScMenu,
	ScMenuItem,
	ScText,
} from '@surecart/components-react';
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies.
 */
import DataTable from '../../../components/DataTable';

export default ({ product, updateProduct, loading }) => {
	const [isDeleting, setIsDeleting] = useState(false);
	const variants = Array.from(product?.variants?.data ?? []);
	const { deleteEntityRecord } = useDispatch(coreStore);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);

	console.log({ product });
	/**
	 * On Delete variant, just update the status as draft.
	 *
	 * TODO: API could be updated.
	 *
	 * @param {object} variant
	 */
	const deleteVariant = async (variant) => {
		try {
			setIsDeleting(true);
			await deleteEntityRecord('surecart', 'variant', variant?.id, {
				throwOnError: true,
			});
			createSuccessNotice(__('Deleted.', 'surecart'), {
				type: 'snackbar',
			});
			setIsDeleting(false);
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart')
			);
			setIsDeleting(false);
		}
	};

	return (
		<DataTable
			title={__('', 'surecart')}
			loading={loading}
			columns={{
				variant: {
					label: __('Variant', 'surecart'),
					width: '200px',
				},
				available: {
					label: __('Available', 'surecart'),
					width: '150px',
				},
				sku: {
					label: __('SKU', 'surecart'),
					width: '150px',
				},
				actions: {
					label: __('', 'surecart'),
				},
			}}
			items={variants.map((variant) => {
				const {
					id,
					sku,
					option_1,
					option_2,
					option_3,
					image,
					product,
				} = variant;
				return {
					variant: (
						<ScFlex
							style={{
								'--font-weight': 'var(--sc-font-weight-bold)',
								gap: '1rem',
								justifyContent: 'flex-start',
							}}
						>
							<div
								style={{
									border: '1px dotted var(--sc-color-gray-200)',
									borderRadius: '4px',
									padding: 'var(--sc-spacing-xx-small)',
								}}
							>
								<ScIcon
									name="image"
									style={{
										'--color': 'var(--sc-color-gray-600)',
									}}
								/>
							</div>

							<ScText
								style={{
									'--font-weight':
										'var(--sc-font-weight-bold)',
									flex: 1,
								}}
							>
								{option_1}
								{option_2?.length > 0 && ' / '} {option_2}
								{option_3?.length > 0 && ' / '} {option_3}
							</ScText>
						</ScFlex>
					),
					available: (
						<ScInput
							type="number"
							min="0"
							value={variant.available}
							onChange={(e) => {
								const value = e.target.value;
								updateProduct({
									variants: {
										data: variants.map((v) => {
											if (v.id === id) {
												return {
													...v,
													available: value,
												};
											}
											return v;
										}),
									},
								});
							}}
						/>
					),
					sku: (
						<ScInput
							value={sku}
							onChange={(e) => {
								const value = e.target.value;
								updateProduct({
									variants: {
										data: variants.map((v) => {
											if (v.id === id) {
												return {
													...v,
													sku: value,
												};
											}
											return v;
										}),
									},
								});
							}}
						/>
					),
					actions: (
						<ScDropdown placement="bottom-end">
							<ScButton type="text" slot="trigger">
								<ScIcon name="more-horizontal" />
							</ScButton>
							<ScMenu>
								<ScMenuItem
									onClick={() => deleteVariant(variant)}
								>
									{isDeleting
										? __('Deleting...', 'surecart')
										: __('Delete', 'surecart')}
								</ScMenuItem>
							</ScMenu>
						</ScDropdown>
					),
				};
			})}
		></DataTable>
	);
};
