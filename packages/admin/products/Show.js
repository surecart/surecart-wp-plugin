/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { Fragment, useEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

import { store as uiStore } from '../store/ui';
import { store as dataStore } from '../store/data';

// template
import Template from '../templates/SingleModel';

// modules
import Details from './modules/Details';
import Prices from './modules/Prices';

// parts
import Sidebar from './Sidebar';

// hocs
import useCurrentPage from '../mixins/useCurrentPage';
import ErrorFlash from '../components/ErrorFlash';
import useEntities from '../mixins/useEntities';
import { ScButton } from '@surecart/components-react';
import ProductActionsDropdown from './components/ProductActionsDropdown';

export default () => {
	const { saveModel, saveDraft, clearDrafts } = useDispatch(dataStore);
	const { addSnackbarNotice, addModelErrors } = useDispatch(uiStore);
	const {
		id,
		product,
		saveProduct,
		deleteProduct,
		isSaving,
		setSaving,
		fetchProduct,
		updateProduct,
		productErrors,
		clearProductErrors,
		isLoading,
	} = useCurrentPage('product');

	const { prices, draftPrices } = useEntities('price');

	// fetch product on load.
	useEffect(() => {
		if (id) {
			fetchProduct(
				{
					query: {
						context: 'edit',
						expand: ['prices', 'product_group', 'files'],
					},
				},
				{ file_upload_ids: [] }
			);
		} else {
			updateProduct({
				tax_enabled: true,
				tax_category: 'digital',
			});
		}
	}, []);

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setSaving(true);
			id ? await updatePage() : await createPage();
			addSnackbarNotice({
				content: __('Saved.'),
			});
		} catch (e) {
			console.error(e);
		} finally {
			setSaving(false);
		}
	};

	/**
	 * Create the page and clear all drafts.
	 */
	const createPage = async () => {
		try {
			const saved = await saveProduct({
				query: {
					context: 'edit',
					expand: ['prices', 'product_group', 'files'],
				},
				data: {
					prices: draftPrices,
				},
			});
			if (saved?.id) {
				await clearDrafts('product');
				return await clearDrafts('price');
			}
		} catch (e) {
			throw e;
		}
	};

	/**
	 * Update product, prices and drafts all at once.
	 */
	const updatePage = async () => {
		return Promise.all([
			saveProduct({
				query: {
					context: 'edit',
					expand: ['prices', 'product_group', 'files'],
				},
			}),
			savePrices(),
			saveDraftPrices(),
		]);
	};

	const saveDraftPrices = async () => {
		try {
			await Promise.all(
				(draftPrices || []).map((price, index) =>
					saveDraftPrice(price, index)
				)
			);
			return await clearDrafts('price');
		} catch (e) {
			addModelErrors('price', e);
			throw e;
		}
	};

	const savePrices = async () => {
		return await Promise.all(
			(prices || []).map((price) => savePrice(price))
		);
	};

	// save price
	const savePrice = async (price) => {
		try {
			return await saveModel('price', price?.id);
		} catch (e) {
			addModelErrors('price', e);
			throw e;
		}
	};

	/** Save any draft prices. */
	const saveDraftPrice = async (_, index) => {
		try {
			return await saveDraft('price', index);
		} catch (e) {
			addModelErrors('price', e);
			throw e;
		}
	};

	const onDeleteProduct = async () => {
		try {
			setSaving(true);
			return await deleteProduct();
		} catch (e) {
			addModelErrors('product', e);
			throw e;
		} finally {
			setSaving(false);
		}
	};

	const onToggleArchiveProduct = async () => {
		try {
			setSaving(true);
			return await saveProduct({
				data: {
					archived: !product?.archived,
				},
			});
		} catch (e) {
			addModelErrors('product', e);
			throw e;
		} finally {
			setSaving(false);
		}
	};

	return (
		<Template
			status={product?.status}
			pageModelName={'product'}
			onSubmit={onSubmit}
			backUrl={'admin.php?page=sc-products'}
			backText={__('Back to All Product', 'surecart')}
			title={
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 1em;
					`}
				>
					{isLoading ? (
						<sc-skeleton
							style={{
								width: '120px',
								display: 'inline-block',
							}}
						></sc-skeleton>
					) : product?.id ? (
						__('Edit Product', 'surecart')
					) : (
						__('Create Product', 'surecart')
					)}
					{product?.archived && (
						<sc-tag type="warning">
							{__('Archived', 'surecart')}
						</sc-tag>
					)}
				</div>
			}
			button={
				isLoading ? (
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
							isSaving={isSaving}
						/>
						<ScButton
							type="primary"
							loading={isSaving}
							disabled={isSaving}
							submit
						>
							{product?.id
								? __('Update Product', 'surecart')
								: __('Create Product', 'surecart')}
						</ScButton>
					</div>
				)
			}
			sidebar={
				<Sidebar
					id={id}
					loading={isLoading}
					product={product}
					updateProduct={updateProduct}
					saveProduct={saveProduct}
				/>
			}
		>
			<Fragment>
				<ErrorFlash
					errors={productErrors}
					onHide={clearProductErrors}
				/>

				<Details
					product={product}
					updateProduct={updateProduct}
					loading={isLoading}
				/>
				<Prices
					productId={id}
					product={product}
					updateProduct={updateProduct}
					loading={isLoading}
				/>
			</Fragment>
		</Template>
	);
};
