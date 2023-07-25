/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useMemo, useState } from '@wordpress/element';
import { PanelRow, Dropdown, Button } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from '@wordpress/block-editor';

/**
 * WordPress dependencies
 */
import {
	ScFlex,
	ScRadio,
	ScRadioGroup,
	ScSkeleton,
} from '@surecart/components-react';

export default ({ product, updateProduct }) => {
	const [saving, setSaving] = useState(false);
	const { editEntityRecord, saveEditedEntityRecord } = useDispatch(coreStore);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);

	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [popoverAnchor, setPopoverAnchor] = useState(null);

	// Memoize popoverProps to avoid returning a new object every time.
	const popoverProps = useMemo(
		() => ({ anchor: popoverAnchor, placement: 'bottom-end' }),
		[popoverAnchor]
	);

	const { prices, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'price',
				{ context: 'edit', product_ids: [product?.id], per_page: 100 },
			];

			// get all prices for this product.
			const prices = select(coreStore).getEntityRecords(...queryArgs);

			// are we loading prices?
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);

			// for all prices, merge with edits
			// we always show the edited version of the price.
			const editedPrices = (prices || [])
				.map((price) => {
					return {
						...price,
						...select(coreStore).getRawEntityRecord(
							'surecart',
							'price',
							price?.id
						),
						...select(coreStore).getEntityRecordEdits(
							'surecart',
							'price',
							price?.id
						),
					};
				})
				// sort by position.
				.sort((a, b) => a?.position - b?.position);

			return {
				prices: editedPrices,
				loading: loading && !prices?.length,
			};
		},
		[product?.id]
	);

	const changeProductType = async (e) => {
		const variantsEnabled = e.target.value;

		// If variants enabled, then we check if product has multiple prices.
		// If it has multiple prices, then we show a warning message and return.
		// else we update the product type to variable.
		if (variantsEnabled === 'yes') {
			if (prices?.length > 1) {
				createErrorNotice(
					__(
						'You cannot change the product type to variable because it has multiple prices. Please keep only one price and try again.',
						'surecart'
					)
				);

				return;
			}
		}

		// We must need to update the product type on product otherwise,
		// saving product prices will not work.
		try {
			setSaving(true);
			await editEntityRecord(
				'surecart',
				'product',
				product?.id,
				{
					variants_enabled: variantsEnabled === 'yes',
				},
				{ throwOnError: true }
			);

			await saveEditedEntityRecord('surecart', 'product', product?.id);

			updateProduct({
				variants_enabled: variantsEnabled === 'yes',
			});
		} catch (e) {
			console.error(e);
			setSaving(false);
		} finally {
			setSaving(false);
		}
	};

	return (
		<PanelRow className="edit-product-type" ref={popoverAnchor}>
			<span>{__('Product type', 'surecart')}</span>
			<Dropdown
				popoverProps={popoverProps}
				className="edit-product-type__dropdown"
				contentClassName="edit-product-type__dialog"
				renderToggle={({ isOpen, onToggle }) => (
					<ProductTypeToggle
						isOpen={isOpen}
						onClick={onToggle}
						product={product}
					/>
				)}
				renderContent={({ onClose }) => (
					<div
						css={css`
							min-width: 248px;
							margin: 8px;

							.block-editor-inspector-popover-header {
								margin-bottom: 16px;
							}
							[class].block-editor-inspector-popover-header__action.has-icon {
								min-width: 24px;
								padding: 0;
							}
							[class].block-editor-inspector-popover-header__action {
								height: 24px;
							}
						`}
					>
						<InspectorPopoverHeader
							title={__('Product type', 'surecart')}
							help={__(
								'Product type determines how the product is displayed on the front-end.',
								'surecart'
							)}
							onClose={onClose}
						/>
						{saving || loading ? (
							<ScFlex
								alignItems="center"
								justifyContent="flex-start"
							>
								<ScSkeleton
									css={css`
										width: 40px;
										height: 40px;
									`}
									style={{
										'--border-radius':
											' var(--sc-border-radius-small)',
									}}
								/>
								<ScSkeleton style={{ width: '25%' }} />
							</ScFlex>
						) : (
							<ScRadioGroup
								label={''}
								onScChange={async (e) => {
									await changeProductType(e);
									onClose();
									createSuccessNotice(
										__('Product type updated.', 'surecart')
									);
								}}
							>
								<ScRadio
									checked={!product?.variants_enabled}
									value={'no'}
									name="variants_enabled"
								>
									{__('Multi-price product', 'surecart')}
								</ScRadio>
								<ScRadio
									checked={product?.variants_enabled}
									value={'yes'}
									name="variants_enabled"
								>
									{__('Variable product', 'surecart')}
								</ScRadio>
							</ScRadioGroup>
						)}
					</div>
				)}
			/>
		</PanelRow>
	);
};

function ProductTypeToggle({ isOpen, onClick, product }) {
	const label = product?.variants_enabled
		? __('Variable product', 'surecart')
		: __('Multi-Price product', 'surecart');

	return (
		<Button
			className="edit-product-type__toggle"
			variant="tertiary"
			aria-expanded={isOpen}
			// translators: %s: Current product type.
			aria-label={sprintf(__('Change Type: %s'), label)}
			onClick={onClick}
		>
			{label}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={2}
				stroke="currentColor"
				width="18"
				height="18"
				style={{
					fill: 'none',
					color: 'var(--sc-color-gray-300)',
					marginLeft: '6px',
					flex: '1 0 18px',
				}}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
				/>
			</svg>
		</Button>
	);
}
