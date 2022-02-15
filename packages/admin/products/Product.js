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
import { useState } from 'react';
import { CeButton } from '@checkout-engine/components-react';

export default () => {
	const { saveModel, updateModel, saveDraft, updateDraft, clearDrafts } =
		useDispatch(dataStore);
	const { addSnackbarNotice, addModelErrors } = useDispatch(uiStore);
	const {
		id,
		product,
		saveProduct,
		isSaving,
		fetchProduct,
		updateProduct,
		productErrors,
		clearProductErrors,
		isLoading,
	} = useCurrentPage('product');
	const { prices, draftPrices } = useEntities('price');
	const [saving, setSaving] = useState(false);

	// fetch product on load.
	useEffect(() => {
		if (id) {
			fetchProduct({
				query: {
					context: 'edit',
					expand: ['prices'],
				},
			});
		} else {
			updateProduct({
				tax_enabled: true,
			});
		}
	}, []);

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setSaving(true);
			id ? await editProduct() : await createProduct();
			addSnackbarNotice({
				content: __('Saved.'),
			});
		} catch (e) {
			console.error(e);
		} finally {
			setSaving(false);
		}
	};

	const createProduct = async () => {
		await saveProduct({
			query: {
				context: 'edit',
				expand: ['prices'],
			},
			data: {
				prices: draftPrices,
			},
		});
		await clearDrafts('product');
		return await clearDrafts('price');
	};

	const editProduct = async () => {
		await saveProduct();
		await Promise.all(
			(prices || []).map((price) => savePrice(price, product))
		);
		await Promise.all(
			(draftPrices || []).map((price, index) =>
				saveDraftPrice(price, index, product)
			)
		);
		return await clearDrafts('price');
	};

	// save price
	const savePrice = async (price) => {
		try {
			return await saveModel('price', price?.id);
		} catch (e) {
			addModelErrors('price', e);
		}
	};

	/** Save any draft prices. */
	const saveDraftPrice = async (_, index) => {
		try {
			return await saveDraft('price', index);
		} catch (e) {
			addModelErrors('price', e);
		}
	};

	return (
		<Template
			status={product?.status}
			pageModelName={'product'}
			onSubmit={onSubmit}
			backUrl={'admin.php?page=ce-products'}
			backText={__('Back to All Product', 'checkout_engine')}
			title={
				isLoading ? (
					<ce-skeleton
						style={{
							width: '120px',
							display: 'inline-block',
						}}
					></ce-skeleton>
				) : product?.id ? (
					__('Edit Product', 'checkout_engine')
				) : (
					__('Create Product', 'checkout_engine')
				)
			}
			button={
				isLoading ? (
					<ce-skeleton
						style={{
							width: '120px',
							height: '35px',
							display: 'inline-block',
						}}
					></ce-skeleton>
				) : (
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 0.5em;
						`}
					>
						{/* <ProductActionsDropdown
							setConfirm={setConfirm}
							product={product}
							isSaving={isSaving}
							toggleArchive={toggleArchive}
						/> */}
						<CeButton
							type="primary"
							loading={saving || isSaving}
							submit
						>
							{product?.id
								? __('Update Product', 'checkout_engine')
								: __('Create Product', 'checkout_engine')}
						</CeButton>
					</div>
				)
			}
			sidebar={
				<Sidebar
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
					product={product}
					updateProduct={updateProduct}
					loading={isLoading}
				/>
			</Fragment>
		</Template>
	);
};
