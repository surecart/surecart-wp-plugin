/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, select } from '@wordpress/data';

// template
import UpdateModel from '../templates/UpdateModel';

// modules
import Details from './modules/Details';
import Prices from './modules/Prices';

// components
import Sidebar from './Sidebar';
import ProductActionsDropdown from './components/ProductActionsDropdown';
import SaveButton from './components/SaveButton';
import Logo from '../templates/Logo';
import Error from '../components/Error';

// hocs
import useEntity from '../hooks/useEntity';
import useSnackbar from '../hooks/useSnackbar';

export default ({ id }) => {
	const [error, setError] = useState(null);
	const {
		product,
		saveProduct,
		editProduct,
		deleteProduct,
		hasLoadedProduct,
		deletingProduct,
		savingProduct,
	} = useEntity('product', id);

	const { addSnackbarNotice } = useSnackbar();

	// save edited entity records.
	const { saveEditedEntityRecord } = useDispatch(coreStore);

	/**
	 * Handle the form submission
	 */
	const onSubmit = async () => {
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
			addSnackbarNotice({
				content: __('Product updated.', 'surecart'),
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

	const button = !hasLoadedProduct ? (
		<sc-skeleton
			style={{
				width: '120px',
				height: '35px',
				display: 'inline-block',
			}}
		></sc-skeleton>
	) : (
		<div
			css={css`
				display: flex;
				align-items: center;
				gap: 0.5em;
			`}
		>
			<ProductActionsDropdown
				product={product}
				onDelete={onDeleteProduct}
				onToggleArchive={onToggleArchiveProduct}
			/>
			<SaveButton busy={deletingProduct || savingProduct}>
				{__('Save Product', 'surecart')}
			</SaveButton>
		</div>
	);

	return (
		<UpdateModel
			onSubmit={onSubmit}
			title={
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
			}
			button={button}
			sidebar={
				<Sidebar
					id={id}
					onToggleArchiveProduct={onToggleArchiveProduct}
					loading={!hasLoadedProduct}
					product={product}
					updateProduct={editProduct}
					saveProduct={saveProduct}
				/>
			}
		>
			<Fragment>
				<Error error={error} setError={setError} margin="80px" />

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
			</Fragment>
		</UpdateModel>
	);
};
