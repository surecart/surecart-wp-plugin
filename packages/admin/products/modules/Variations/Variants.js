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
	 * On Delete variant, just update the status as draft for that variant.
	 *
	 * @param {object} variant
	 */
	const toggleDelete = async (variant) => {
		const event = {
			target: {
				name: 'status',
				value: variant?.status === 'draft' ? 'publish' : 'draft',
			},
		};
		updateVariantValue(event, variants.indexOf(variant));
	};

	const updateVariantValue = (e, index) => {
		const value = e.target.value;
		const name = e.target.name;

		updateProduct({
			variants: {
				...product?.variants,
				data: variants.map((variant, index2) => {
					if (index2 === index) {
						return {
							...variant,
							[name]: value,
						};
					}
					return variant;
				}),
			},
		});
	};

	const renderVariantName = (variant) => {
		const { option_1, option_2, option_3, status } = variant;

		if (status !== 'draft') {
			return (
				<>
					{option_1}
					{option_2?.length > 0 && ' / '} {option_2}
					{option_3?.length > 0 && ' / '} {option_3}
				</>
			);
		} else {
			return (
				<del style={{ color: 'var(--sc-color-gray-400)' }}>
					{option_1}
					{option_2?.length > 0 && ' / '} {option_2}
					{option_3?.length > 0 && ' / '} {option_3}
				</del>
			);
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
				amount: {
					label: __('Price', 'surecart'),
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
			items={variants.map((variant, index) => {
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
										disabled: variant.status === 'draft',
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
								{renderVariantName(variant)}
							</ScText>
						</ScFlex>
					),
					amount: (
						<ScInput
							type="number"
							min="0"
							value={variant.amount}
							name="amount"
							disabled={variant.status === 'draft'}
							onScChange={(e) => updateVariantValue(e, index)}
						/>
					),
					sku: (
						<ScInput
							value={sku}
							name="sku"
							disabled={variant.status === 'draft'}
							onScChange={(e) => updateVariantValue(e, index)}
						/>
					),
					actions: (
						<ScDropdown placement="bottom-end">
							<ScButton type="text" slot="trigger">
								<ScIcon name="more-horizontal" />
							</ScButton>
							<ScMenu>
								<ScMenuItem
									onClick={() => toggleDelete(variant)}
								>
									{variant?.status === 'draft'
										? __('Activate', 'surecart')
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
