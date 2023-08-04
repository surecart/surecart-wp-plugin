/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from 'react';

import { ScAlert, ScButton, ScForm, ScInput } from '@surecart/components-react';
import CreateTemplate from '../templates/CreateModel';
import Box from '../ui/Box';
import ProductType from './modules/ProductType';

export default ({ id, setId }) => {
	const [isSaving, setIsSaving] = useState(false);
	const [name, setName] = useState('');
	const [variantsEnabled, setVariantsEnabled] = useState(false);
	const [error, setError] = useState('');
	const { saveEntityRecord } = useDispatch(coreStore);

	// create the product.
	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsSaving(true);
			const product = await saveEntityRecord(
				'surecart',
				'product',
				{
					name,
					auto_fulfill_enabled: true,
				},
				{ throwOnError: true }
			);

			if (!product?.id) {
				throw {
					message: __(
						'Could not create product. Please try again.',
						'sureacrt'
					),
				};
			}

			setId(product.id);
		} catch (e) {
			console.error(e);
			setError(e?.message || __('Something went wrong.', 'surecart'));
			setIsSaving(false);
		}
	};

	return (
		<CreateTemplate id={id}>
			<ScAlert open={error?.length} type="danger" closable scrollOnOpen>
				<span slot="title">{error}</span>
			</ScAlert>

			<Box title={__('Create New Product', 'surecart')}>
				<ScForm onScSubmit={onSubmit}>
					<div
						css={css`
							display: grid;
							gap: var(--sc-spacing-large);
						`}
					>
						<ScInput
							label={__('Product Name', 'surecart')}
							className="sc-product-name hydrated"
							help={__('A name for your product.', 'surecart')}
							onScChange={(e) => {
								setName(e.target.value);
							}}
							value={name}
							name="name"
							required
							autofocus
						/>

						<ProductType
							variantsEnabled={variantsEnabled}
							setVariantsEnabled={setVariantsEnabled}
						/>

						<div
							css={css`display: flex gap: var(--sc-spacing-small);`}
						>
							<ScButton type="primary" submit loading={isSaving}>
								{__('Create', 'surecart')}
							</ScButton>
							<ScButton
								href={'admin.php?page=sc-products'}
								type="text"
							>
								{__('Cancel', 'surecart')}
							</ScButton>
						</div>
					</div>
				</ScForm>
			</Box>
		</CreateTemplate>
	);
};
