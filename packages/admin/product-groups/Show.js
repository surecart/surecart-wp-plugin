import { CeButton, CeSwitch } from '@checkout-engine/components-react';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';
import { store as uiStore } from '../store/ui';
import { store as dataStore } from '../store/data';
import useCurrentPage from '../mixins/useCurrentPage';
import useEntities from '../mixins/useEntities';
// template
import Template from '../templates/SingleModel';
import Details from './modules/Details';
import Products from './modules/Products';

export default () => {
	const {
		id,
		product_group,
		isLoading: isGroupLoading,
		updateProductgroup,
		fetchProductgroup,
		saveProductgroup,
		isSaving,
		setSaving,
	} = useCurrentPage('product_group');
	const { saveModel } = useDispatch(dataStore);
	const { addSnackbarNotice, addModelErrors } = useDispatch(uiStore);
	const { products, fetchProducts, addProduct, isLoading } =
		useEntities('product');

	useEffect(() => {
		if (!id) return;
		console.log({ id });
		// fetchProducts({
		// 	query: {
		// 		product_group_ids: [id],
		// 		recurring: true,
		// 		expand: ['prices', 'product_group'],
		// 	},
		// });
		// fetchProductgroup({});
	}, [id]);

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setSaving(true);
			await updatePage();
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
		return Promise.all([saveProductgroup(), saveProducts()]);
	};

	/**
	 * Save products.
	 */
	const saveProducts = async () => {
		return await Promise.all(
			(products || []).map((product) => saveProduct(product))
		);
	};

	/**
	 * Save product.
	 */
	const saveProduct = async (product) => {
		try {
			return await saveModel('product', product?.id);
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
		} catch (e) {
			addModelErrors('product_group', e);
			console.error(e);
		} finally {
			setSaving(false);
		}
	};

	return (
		<Template
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
							onClick={confirmArchiveToggle}
						>
							{product_group?.archived
								? __('Un-Archive Group', 'checkout_engine')
								: __('Archive Group', 'checkout_engine')}
						</CeButton>
						<CeButton type="primary" loading={isSaving} submit>
							{id
								? __('Update Group', 'checkout_engine')
								: __('Create Group', 'checkout_engine')}
						</CeButton>
					</ce-flex>
				)
			}
		>
			<Details
				productGroup={product_group}
				updateProductGroup={updateProductgroup}
				loading={isLoading || isGroupLoading}
			/>
			<Products
				id={id}
				products={products}
				fetchProducts={fetchProducts}
				addProduct={addProduct}
				loading={isLoading || isGroupLoading}
			/>
		</Template>
	);
};
