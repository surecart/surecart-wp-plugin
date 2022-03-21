/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { CeButton } from '@checkout-engine/components-react';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';
import { store as uiStore } from '../store/ui';
import { store as dataStore } from '../store/data';
import { addQueryArgs } from '@wordpress/url';
import useEntities from '../mixins/useEntities';
// template
import Template from '../templates/SingleModel';
import Details from './modules/Details';
import Products from './modules/Products';
import useEntity from '../mixins/useEntity';

export default ({ id }) => {
	const { saveModel } = useDispatch(dataStore);
	const { addSnackbarNotice, addModelErrors } = useDispatch(uiStore);
	const {
		product_group,
		isLoading: isGroupLoading,
		updateProductgroup,
		fetchProductgroup,
		saveProductgroup,
		isSaving,
		setSaving,
	} = useEntity('product_group', id);
	const { products, fetchProducts, isLoading } = useEntities('product');

	useEffect(() => {
		if (!id) return;
		fetchProducts({
			query: {
				product_group_ids: [id],
				recurring: true,
				expand: ['prices'],
			},
		});
		fetchProductgroup({});
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
			addModelErrors('product_group', e);
		} finally {
			setSaving(false);
		}
	};

	/**
	 * Update product, prices and drafts all at once.
	 */
	const updatePage = async () => {
		return Promise.all([saveProductgroup(), saveProducts(id)]);
	};

	/**
	 * Create the page and clear all drafts.
	 */
	const createPage = async () => {
		try {
			const saved = await saveProductgroup();
			if (saved?.id) {
				await saveProducts(saved?.id);
			}
		} catch (e) {
			throw e;
		}
	};

	/**
	 * Save products.
	 */
	const saveProducts = async (product_group) => {
		return await Promise.all(
			(products || []).map(({ id, ...data }) => {
				return saveProduct(id, { ...data, product_group });
			})
		);
	};

	/**
	 * Save product.
	 */
	const saveProduct = async (id, data) => {
		try {
			return await saveModel('product', id, {
				data,
				query: { expand: ['prices'] },
			});
		} catch (e) {
			addModelErrors('product', e);
			throw e;
		}
	};

	const confirmArchiveToggle = async () => {
		const r = confirm(
			product_group?.archived
				? __('Are you sure you want to un-archive this product group?')
				: __('Are you sure you want to archive this product group?')
		);
		if (!r) return;
		try {
			setSaving(true);
			await saveProductgroup({
				data: {
					archived: !product_group?.archived,
				},
			});
			addSnackbarNotice({
				content: product_group?.archived
					? __('Un-archived.', 'checkout_engine')
					: __('Archived.', 'checkout_engine'),
			});
			window.location.assign(
				addQueryArgs('admin.php', {
					page: 'ce-product-groups',
				})
			);
		} catch (e) {
			addModelErrors('product_group', e);
			console.error(e);
			setSaving(false);
		}
	};

	return (
		<Template
			id={id}
			backUrl={'admin.php?page=ce-product-groups'}
			backText={__('Back to upgrade groups list.', 'checkout_engine')}
			title={
				<ce-flex align-items="center">
					{id
						? __('Edit Upgrade Group', 'checkout_engine')
						: __('Create Upgrade Group', 'checkout_engine')}
					{product_group?.archived && (
						<ce-tag type="warning">
							{__('Archived', 'checkout_engine')}
						</ce-tag>
					)}
				</ce-flex>
			}
			pageModelName={'product_group'}
			onSubmit={onSubmit}
			button={
				isLoading || isGroupLoading ? (
					<ce-skeleton
						style={{
							width: '120px',
							height: '35px',
							display: 'inline-block',
						}}
					></ce-skeleton>
				) : (
					<ce-flex align-items="center">
						<CeButton
							loading={isSaving}
							type="text"
							onClick={confirmArchiveToggle}
						>
							{product_group?.archived
								? __('Un-Archive', 'checkout_engine')
								: __('Archive', 'checkout_engine')}
						</CeButton>
						<CeButton type="primary" loading={isSaving} submit>
							{__('Update', 'checkout_engine')}
						</CeButton>
					</ce-flex>
				)
			}
		>
			<Details
				id={id}
				productGroup={product_group}
				updateProductGroup={updateProductgroup}
				loading={isLoading || isGroupLoading}
			/>
			{!!id && (
				<Products
					id={id}
					products={products}
					loading={isLoading || isGroupLoading}
				/>
			)}
		</Template>
	);
};
