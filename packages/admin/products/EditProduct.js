/** @jsx jsx */
import { Global, css, jsx } from '@emotion/core';
import { ScButton, ScTag } from '@surecart/components-react';
import { external } from '@wordpress/icons';
import { Button } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { select, useDispatch, useSelect } from '@wordpress/data';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { getQueryArg, addQueryArgs } from '@wordpress/url';
import { applyFilters, doAction } from '@wordpress/hooks';
import apiFetch from '@wordpress/api-fetch';

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
import Variations from './modules/Variations';
import Shipping from './modules/Shipping';
import Inventory from './modules/Inventory';
import Affiliation from './modules/Affiliation';
import Collection from './modules/Collection';
import MetaBoxes from './modules/MetaBoxes';
import Taxonomies from './modules/Taxonomies';
import Editor from './components/Editor';

export default ({ id, setBrowserURL }) => {
	const [error, setError] = useState(null);
	const [saving, setSaving] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { saveEditedEntityRecord } = useDispatch(coreStore);
	const { setEditedPost } = useDispatch('core/editor');

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

	const isSavingMetaBoxes = useSelect((select) =>
		select('surecart/metaboxes').isSavingMetaBoxes()
	);

	const currentPost = useSelect((select) =>
		select('core/editor').getCurrentPost()
	);

	const { post, loadingPost } = useSelect(
		(select) => {
			const queryArgs = [
				'postType',
				'sc_product',
				{
					sc_id: [id],
					per_page: 1,
				},
			];
			const posts =
				select(coreStore).getEntityRecords(...queryArgs) || [];

			return {
				post: posts?.[0]
					? select(coreStore).getEditedEntityRecord(
							'postType',
							'sc_product',
							posts?.[0]?.id
					  )
					: null,
				loadingPost: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[id]
	);

	useEffect(() => {
		if (!post?.id) {
			return;
		}
		setEditedPost('sc_product', post?.id);
	}, [post]);

	/**
	 * Whether the product should be published.
	 */
	const willPublish = () =>
		select(coreStore).getEntityRecordEdits('surecart', 'product', id)
			?.status === 'published';

	useEffect(() => {
		if (
			getQueryArg(window.location.href, 'status') === 'publish' &&
			hasLoadedProduct
		) {
			editProduct({ status: 'published' });
		}
	}, [hasLoadedProduct]);

	/**
	 * Handle the form submission
	 */
	const onSubmit = async (e) => {
		try {
			setError(null);
			setSaving(true);

			// if we don't have any product edits, run sync directly.
			if (
				!select(coreStore).hasEditsForEntityRecord(
					'surecart',
					'product',
					id
				)
			) {
				const { baseURL } = select(coreStore).getEntityConfig(
					'surecart',
					'product'
				);
				// sync the item.
				await apiFetch({
					method: 'POST',
					path: addQueryArgs(`${baseURL}/${id}/sync`, {}),
				});
			}

			// build up pending records to save (like post, or product)
			const dirtyRecords =
				select(coreStore).__experimentalGetDirtyEntityRecords();
			const pendingSavedRecords = [];
			dirtyRecords.forEach(({ kind, name, key }) => {
				pendingSavedRecords.push(
					saveEditedEntityRecord(kind, name, key)
				);
			});

			// add metaboxes to pending records.
			if (post) {
				const metaboxes = applyFilters(
					'surecart.saveProduct',
					Promise.resolve(),
					{}
				);
				pendingSavedRecords.push(metaboxes);
			}

			// check values.
			const values = await Promise.all(pendingSavedRecords);

			if (values.some((value) => typeof value === 'undefined')) {
				throw new Error('Saving failed.');
			}

			// fire save event.
			doAction('surecart.productSaved', product);

			// unload acf if it exists.
			// TODO: move to a separate function.
			if (!!window?.acf?.unload?.reset) {
				window.acf.unload.reset();
			}

			// remove all args from the url.
			setBrowserURL({ id });
			// save success.
			createSuccessNotice(__('Product updated.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setSaving(false);
		}
	};

	/**
	 * Toggle product delete.
	 */
	const onDeleteProduct = async () => {
		try {
			setError(null);
			await deleteProduct({ throwOnError: true });

			createSuccessNotice(__('Product deleted.', 'surecart'), {
				type: 'snackbar',
			});

			// Redirect to products page.
			window.location.href = addQueryArgs('admin.php', {
				page: 'sc-products',
			});
		} catch (e) {
			setError(e);
		}
	};

	/**
	 * Toggle Product Archive
	 */
	const onToggleArchiveProduct = async () => {
		try {
			setError(null);
			await saveProduct({ archived: !product?.archived });
		} catch (e) {
			setError(e);
		}
	};

	const renderStatusBadge = () => {
		if (!product?.id) return null;
		if (product?.archived) {
			return <ScTag type="warning">{__('Archived', 'surecart')}</ScTag>;
		}
		return null;
	};

	return (
		<>
			<Global
				styles={css`
					#screen-meta-links {
						display: none;
					}
					[type='text'],
					[type='email'],
					[type='url'],
					[type='password'],
					[type='number'],
					[type='date'],
					[type='datetime-local'],
					[type='month'],
					[type='search'],
					[type='tel'],
					[type='time'],
					[type='week'],
					[multiple],
					textarea,
					select {
						appearance: none;
						background-color: inherit;
						border-color: inherit;
						border-width: inherit;
						border-radius: inherit;
						padding-top: unset;
						padding-right: unset;
						padding-bottom: unset;
						padding-left: unset;
						font-size: unset;
					}
				`}
			/>
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
									{renderStatusBadge()}
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

						{!!product?.permalink && (
							<Button
								icon={external}
								label={__('View Product Page', 'surecart')}
								href={product?.permalink}
								showTooltip={true}
								size="compact"
								target="_blank"
							/>
						)}

						<BuyLink
							product={product}
							updateProduct={editProduct}
							loading={!hasLoadedProduct}
						/>

						<SaveButton
							busy={
								deletingProduct ||
								savingProduct ||
								!hasLoadedProduct ||
								isSavingMetaBoxes ||
								saving
							}
						>
							{willPublish()
								? __('Save & Publish', 'surecart')
								: __('Save Product', 'surecart')}
						</SaveButton>
					</div>
				}
				sidebar={
					<>
						<Publishing
							id={id}
							product={product}
							post={post}
							onToggleArchiveProduct={onToggleArchiveProduct}
							updateProduct={editProduct}
							loading={!hasLoadedProduct}
						/>
						<Shipping
							product={product}
							updateProduct={editProduct}
							loading={!hasLoadedProduct}
						/>
						<Tax
							product={product}
							updateProduct={editProduct}
							loading={!hasLoadedProduct}
						/>
						<Collection
							product={product}
							updateProduct={editProduct}
							loading={!hasLoadedProduct}
						/>
						<Taxonomies
							currentPost={currentPost}
							product={product}
						/>
						<Advanced
							product={product}
							updateProduct={editProduct}
							loading={!hasLoadedProduct}
						/>

						<Affiliation
							product={product}
							updateProduct={editProduct}
							loading={!hasLoadedProduct}
							error={error}
						/>

						<MetaBoxes location="side" />
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

					<Editor
						product={product}
						updateProduct={editProduct}
						loading={!hasLoadedProduct}
					/>

					<Image
						productId={id}
						product={product}
						updateProduct={editProduct}
					/>

					<Prices
						productId={id}
						product={product}
						updateProduct={editProduct}
						loading={!hasLoadedProduct}
					/>

					<Inventory
						product={product}
						updateProduct={editProduct}
						loading={!hasLoadedProduct}
					/>

					<Variations
						productId={id}
						product={product}
						updateProduct={editProduct}
						loading={!hasLoadedProduct}
					/>

					<Integrations id={id} product={product} />

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
					<MetaBoxes location="normal" />
					<MetaBoxes location="advanced" />
				</Fragment>
			</UpdateModel>
		</>
	);
};
