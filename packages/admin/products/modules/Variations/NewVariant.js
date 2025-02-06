/** @jsx jsx */
import { css, Global, jsx } from '@emotion/core';
import {
	ScButton,
	ScForm,
	ScFormControl,
	ScInput,
	ScPriceInput,
} from '@surecart/components-react';
import { Modal } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { Fragment, useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Error from '../../../components/Error';
import Image from './Image';

export default ({ product, updateProduct, onRequestClose }) => {
	const [variant, setVariant] = useState(null);
	const [error, setError] = useState(null);

	const prices = useSelect(
		(select) =>
			(
				select(coreStore).getEntityRecords('surecart', 'price', {
					context: 'edit',
					product_ids: [product?.id],
					per_page: 100,
				}) || []
			).filter((price) => !price?.archived),
		[product?.id]
	);

	const onSubmit = async (e) => {
		e.preventDefault();
		updateProduct({
			variants: [...product?.variants, variant],
		});
		onRequestClose();
	};

	const updateVariant = (data) => {
		setVariant({
			...variant,
			...data,
		});
	};

	const onDeleteMedia = async () => {
		const confirmDeleteMedia = confirm(
			__(
				'Are you sure you wish to delete this variant image? This cannot be undone.',
				'surecart'
			)
		);
		if (!confirmDeleteMedia) return;
		updateVariant({ image: null });
	};

	return (
		<Fragment>
			<Global
				styles={css`
					.sc-modal-overflow .components-modal__frame {
						overflow: visible !important;
					}
				`}
			/>
			<Modal
				title={__('Add Variant', 'surecart')}
				css={css`
					max-width: 600px !important;
					.components-modal__content {
						overflow: auto !important;
					}
				`}
				overlayClassName={'sc-modal-overflow'}
				onRequestClose={onRequestClose}
				shouldCloseOnClickOutside={false}
			>
				<ScForm
					onScFormSubmit={onSubmit}
					css={css`
						--sc-form-row-spacing: var(--sc-spacing-small);
					`}
				>
					<Error error={error} setError={setError} />

					<div>
						{product?.variant_options?.map((option, index) => (
							<ScInput
								key={index}
								css={css`
									margin-bottom: var(--sc-spacing-small);
								`}
								value={variant?.[`option_${index + 1}`] ?? ''}
								label={option?.name}
								required
								tabindex="0"
								onScInput={(e) =>
									updateVariant({
										[`option_${index + 1}`]: e.target.value,
									})
								}
							/>
						))}

						<ScInput
							value={variant?.sku}
							name="sku"
							label={__('SKU', 'surecart')}
							css={css`
								margin-bottom: var(--sc-spacing-small);
							`}
							onScInput={(e) =>
								updateVariant({ sku: e.target.value })
							}
						/>

						{prices?.length <= 1 && (
							<ScPriceInput
								type="number"
								min="0"
								value={variant?.amount ?? ''}
								currency={scData?.currency_code}
								name="amount"
								label={__('Price', 'surecart')}
								css={css`
									margin-bottom: var(--sc-spacing-small);
								`}
								onScInput={(e) =>
									updateVariant({ amount: e.target.value })
								}
							/>
						)}

						{!!product?.stock_enabled && (
							<ScInput
								label={__('Stock Qty', 'surecart')}
								value={variant?.stock_adjustment}
								onScInput={(e) =>
									updateVariant({
										stock_adjustment: parseInt(
											e.target.value || 0
										),
									})
								}
								type="number"
								css={css`
									margin-bottom: var(--sc-spacing-large);
								`}
							/>
						)}

						<ScFormControl label={__('Image', 'surecart')}>
							<Image
								variant={variant}
								onRemove={onDeleteMedia}
								onAdd={(media) => {
									updateVariant({
										image_id: media?.id,
										image_url: media?.url,
									});
								}}
							>
								<div
									css={css`
										display: flex;
										height: 3rem;
										align-items: center;
										justify-content: center;
									`}
								>
									<ScButton type="text">
										{__('Add Image', 'surecart')}
									</ScButton>
								</div>
							</Image>
						</ScFormControl>
					</div>

					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 0.5em;
							margin-top: var(--sc-spacing-large);
						`}
					>
						<ScButton type="primary" submit>
							{__('Add Variant', 'surecart')}
						</ScButton>
						<ScButton type="text" onClick={onRequestClose}>
							{__('Cancel', 'surecart')}
						</ScButton>
					</div>
				</ScForm>
			</Modal>
		</Fragment>
	);
};
