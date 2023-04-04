/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScButton } from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { select, useDispatch, useSelect } from '@wordpress/data';
import { Fragment, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

import Error from '../components/Error';
import useEntity from '../hooks/useEntity';
import Logo from '../templates/Logo';
import UpdateModel from '../templates/UpdateModel';
import ActionsDropdown from './components/product/ActionsDropdown';
import SaveButton from './components/product/SaveButton';
import BuyLink from './modules/BuyLink';

import Advanced from './modules/Advanced';
import Details from './modules/Details';
import Downloads from './modules/Downloads';
import Image from './modules/Image';
import Integrations from './modules/integrations/Integrations';
import Licensing from './modules/Licensing';
import Prices from './modules/Prices';
import Publishing from './modules/Publishing';
import SearchEngine from './modules/SearchEngine';
import Tax from './modules/Tax';

export default ({ id }) => {
	const [error, setError] = useState(null);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { saveEditedEntityRecord } = useDispatch(coreStore);
	const {
		product,
		saveProduct,
		saveProductError,
		editProduct,
		deleteProduct,
		hasLoadedProduct,
		deletingProduct,
		savingProduct,
		productError,
	} = useEntity('product', id);

	/**
	 * Handle the form submission
	 */
	const onSubmit = async (e) => {
		try {
			setError(null);

			// build up pending records to save.
			const dirtyRecords =
				select(coreStore).__experimentalGetDirtyEntityRecords();
			const pendingSavedRecords = [];
			dirtyRecords.forEach(({ kind, name, key }) => {
				pendingSavedRecords.push(
					saveEditedEntityRecord(kind, name, key)
				);
			});

			// check values.
			const values = await Promise.all(pendingSavedRecords);
			if (values.some((value) => typeof value === 'undefined')) {
				throw new Error('Saving failed.');
			}

			// save success.
			createSuccessNotice(__('Product updated.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			setError(e);
		}
	};

	/**
	 * Toggle product delete.
	 */
	const onDeleteProduct = async () => {
		const r = confirm(
			sprintf(
				__(
					'Permanently delete %s? You cannot undo this action.',
					'surecart'
				),
				product?.name || 'Product'
			)
		);
		if (!r) return;

		try {
			setError(null);
			await deleteProduct({ throwOnError: true });
		} catch (e) {
			setError(e);
		}
	};

	/**
	 * Toggle Product Archive
	 */
	const onToggleArchiveProduct = async () => {
		const r = confirm(
			product?.archived
				? sprintf(
						__(
							'Un-Archive %s? This will make the product purchaseable again.',
							'surecart'
						),
						product?.name || 'Product'
				  )
				: sprintf(
						__(
							'Archive %s? This product will not be purchaseable and all unsaved changes will be lost.',
							'surecart'
						),
						product?.name || 'Product'
				  )
		);
		if (!r) return;

		try {
			setError(null);
			await saveProduct({ archived: !product?.archived });
		} catch (e) {
			setError(e);
		}
	};

	return (
		<UpdateModel
			onSubmit={onSubmit}
			title={
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 1em;
					`}
				>
					<ScButton
						circle
						size="small"
						href="admin.php?page=sc-products"
					>
						<sc-icon name="arrow-left"></sc-icon>
					</ScButton>
					<sc-breadcrumbs>
						<sc-breadcrumb>
							<Logo display="block" />
						</sc-breadcrumb>
						<sc-breadcrumb href="admin.php?page=sc-products">
							{__('Products', 'surecart')}
						</sc-breadcrumb>
						<sc-breadcrumb>
							<sc-flex style={{ gap: '1em' }}>
								{__('Edit Product', 'surecart')}
								{product?.archived && (
									<>
										{' '}
										<sc-tag type="warning">
											{__('Archived', 'surecart')}
										</sc-tag>
									</>
								)}
							</sc-flex>
						</sc-breadcrumb>
					</sc-breadcrumbs>
				</div>
			}
			button={
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					<ActionsDropdown
						product={product}
						onDelete={onDeleteProduct}
						onToggleArchive={onToggleArchiveProduct}
					/>

					<BuyLink
						product={product}
						updateProduct={editProduct}
						loading={!hasLoadedProduct}
					/>

					<SaveButton
						busy={
							deletingProduct ||
							savingProduct ||
							!hasLoadedProduct
						}
					>
						{__('Save Product', 'surecart')}
					</SaveButton>
				</div>
			}
			sidebar={
				<>
					<Publishing
						id={id}
						product={product}
						onToggleArchiveProduct={onToggleArchiveProduct}
						updateProduct={editProduct}
						loading={!hasLoadedProduct}
					/>
					<Tax
						product={product}
						updateProduct={editProduct}
						loading={!hasLoadedProduct}
					/>
					<Image
						product={product}
						updateProduct={editProduct}
						loading={!hasLoadedProduct}
					/>
					<Advanced
						product={product}
						updateProduct={editProduct}
						loading={!hasLoadedProduct}
					/>
				</>
			}
		>
			<Fragment>
				<Error
					error={saveProductError || productError || error}
					setError={setError}
					margin="80px"
				/>

				<Details
					product={product}
					updateProduct={editProduct}
					loading={!hasLoadedProduct}
				/>

				<Prices
					productId={id}
					product={product}
					updateProduct={editProduct}
					loading={!hasLoadedProduct}
				/>

				<Integrations id={id} />

				<Downloads
					id={id}
					product={product}
					updateProduct={editProduct}
					loading={!hasLoadedProduct}
				/>

				<Licensing
					id={id}
					product={product}
					updateProduct={editProduct}
					loading={!hasLoadedProduct}
				/>
				<SearchEngine
					product={product}
					updateProduct={editProduct}
					loading={!hasLoadedProduct}
				/>
			</Fragment>
		</UpdateModel>
	);
};
