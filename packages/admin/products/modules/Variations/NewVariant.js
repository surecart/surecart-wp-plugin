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
import { useDispatch } from '@wordpress/data';
import { Fragment, useState } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Error from '../../../components/Error';
import Image from './Image';
import { validateVariant } from './utils';

export default ({ product, updateProduct, onRequestClose, loading }) => {
	const [item, setItem] = useState(null);
	const [error, setError] = useState(null);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const onSubmit = async (e) => {
		e.preventDefault();

		// Validation if this options already exists
		const validationErrorMessage = validateVariant(product?.variants, item);
		if (validationErrorMessage) {
			setError(validationErrorMessage);
			return;
		}

		// Update product
		updateProduct({
			variants: [
				...product?.variants,
				{
					...item,
					index: product?.variants.length,
				},
			],
		});

		// Close modal
		onRequestClose();
	};

	const updateVariantValue = (e) => {
		const value = e.target.value;
		const name = e.target.name;

		setItem({
			...item,
			[name]: value,
		});
	};

	const onAddMedia = async (media, variant) => {
		const event = {
			target: {
				name: 'image',
				value: media,
			},
		};
		updateVariantValue(event, product?.variants.indexOf(variant));
		createSuccessNotice(__('Variant Image updated.', 'surecart'), {
			type: 'snackbar',
		});
	};

	const onDeleteMedia = async (media, variant) => {
		const confirmDeleteMedia = confirm(
			__(
				'Are you sure you wish to delete this variant image? This cannot be undone.',
				'surecart'
			)
		);
		if (!confirmDeleteMedia) return;

		updateVariantValue(
			{
				target: {
					name: 'image',
					value: null,
				},
			},
			product?.variants.indexOf(variant)
		);
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
								value={item?.[`option_${index + 1}`] ?? ''}
								label={option?.name}
								name={`option_${index + 1}`}
								required
								css={css`
									margin-bottom: var(--sc-spacing-small);
								`}
								onScChange={updateVariantValue}
							/>
						))}

						<ScInput
							value={item?.sku}
							name="sku"
							label={__('SKU', 'surecart')}
							css={css`
								margin-bottom: var(--sc-spacing-small);
							`}
							onScChange={updateVariantValue}
						/>

						<ScPriceInput
							type="number"
							min="0"
							value={item?.amount ?? ''}
							currency={'usd'}
							name="amount"
							label={__('Price', 'surecart')}
							css={css`
								margin-bottom: var(--sc-spacing-large);
							`}
							onScChange={updateVariantValue}
						/>

						<div>
							{!!item?.image ? (
								<div
									css={css`
										position: relative;
										margin-right: 6px;
									`}
								>
									<img
										src={item?.image?.url}
										alt="product image"
										css={css`
											width: 1.5rem;
											height: 1.5rem;
										`}
									/>
									<ScIcon
										name="trash"
										slot="suffix"
										css={css`
											position: absolute;
											right: -14px;
											top: -12px;
											cursor: pointer;
											opacity: 0.8;
											&:hover {
												opacity: 1;
											}
										`}
										onClick={() =>
											onDeleteMedia(item?.image, item)
										}
									/>
								</div>
							) : (
								<ScFormControl
									label={__('Image', 'surecart')}
									css={css`
										margin-bottom: var(--sc-spacing-small);
									`}
								>
									<Image
										variant={item}
										product={product}
										updateProduct={updateProduct}
										existingMediaIds={
											item?.image?.length > 0
												? [item?.image?.media?.id]
												: []
										}
										onAddMedia={(medias) =>
											onAddMedia(medias, item)
										}
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
							)}
						</div>
					</div>

					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 0.5em;
							margin-top: var(--sc-spacing-large);
						`}
					>
						<ScButton
							type="primary"
							style={{
								'--button-border-radius':
									'--sc-input-border-radius-small',
								cursor: 'pointer',
							}}
							busy={loading}
							disabled={loading}
							submit
						>
							{__('Add Variant', 'surecart')}
						</ScButton>
						<ScButton type="text" onClick={onRequestClose}>
							{__('Cancel', 'surecart')}
						</ScButton>
					</div>
					{loading && <sc-block-ui></sc-block-ui>}
				</ScForm>
			</Modal>
		</Fragment>
	);
};
