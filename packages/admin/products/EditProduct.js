/** @jsx jsx */
import { Global, css, jsx } from '@emotion/core';
import { ScButton, ScTag } from '@surecart/components-react';
import { external } from '@wordpress/icons';
import { Button } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { select, useDispatch, useSelect } from '@wordpress/data';
import { Fragment, useCallback, useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { getQueryArg, addQueryArgs } from '@wordpress/url';
import { doAction } from '@wordpress/hooks';
import apiFetch from '@wordpress/api-fetch';

import Error from '../components/Error';
import { useNavigationConfirm } from '../router';
import useEntity from '../hooks/useEntity';
import Logo from '../templates/Logo';
import UpdateModel from '../templates/UpdateModel';
import ActionsDropdown from './components/product/ActionsDropdown';
import SaveButton from './components/product/SaveButton';
import BuyLink from './modules/BuyLink';

import Advanced from './modules/Advanced';
import Details from './modules/Details';
import Downloads from './modules/Downloads';
import Media from './modules/Media';
import Integrations from './modules/integrations/Integrations';
import Licensing from './modules/Licensing';
import Prices from './modules/Prices';
import Publishing from './modules/Publishing';
import SearchEngine from './modules/SearchEngine';
import Tax from './modules/Tax';
import Template from './modules/Template';
import Variations from './modules/Variations';
import Shipping from './modules/Shipping';
import Inventory from './modules/Inventory';
import Affiliation from './modules/Affiliation';
import Collection from './modules/Collection';
import Taxonomies from './modules/Taxonomies';
import Reviews from './modules/Reviews';
import Editor from './components/Editor';
import ConfirmNavigation from './components/ConfirmNavigation';
import ProductOptions from './modules/ProductOptions';

export default ({ id, setBrowserURL, navigation }) => {
	const [error, setError] = useState(null);
	const [saving, setSaving] = useState(false);
	const [confirmUrl, setConfirmUrl] = useState(null);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { saveEditedEntityRecord } = useDispatch(coreStore);
	const { setEditedPost } = useDispatch('core/editor');
	const { requestNavigation, setDefaultSuccessMessage } =
		useNavigationConfirm();

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

	const saveSuccessMessage = product?.id
		? __('Product updated.', 'surecart')
		: __('Product created.', 'surecart');

	// So the browser-back path shows this message too (it can't pass params).
	useEffect(() => {
		setDefaultSuccessMessage(saveSuccessMessage);
		return () => setDefaultSuccessMessage(null);
	}, [saveSuccessMessage, setDefaultSuccessMessage]);

	// Prompts to save/discard unsaved changes before going back to the list.
	// requestNavigation needs raw router params rather than navigation.goToList()
	// because NavigationConfirmProvider operates on history params directly.
	const backToList = useCallback(() => {
		if (navigation) {
			requestNavigation(
				{ page: navigation.pageSlug },
				{ successMessage: saveSuccessMessage }
			);
		} else {
			// Non-SPA context: navigate directly. Dirty-record check is SPA-only.
			window.location.href = 'admin.php?page=sc-products';
		}
	}, [requestNavigation, navigation, saveSuccessMessage]);

	const currentPost = useSelect((select) =>
		select('core/editor').getCurrentPost()
	);

	const hasDirtyRecords = useSelect((select) => {
		const { __experimentalGetDirtyEntityRecords } = select(coreStore);
		const dirtyEntityRecords = __experimentalGetDirtyEntityRecords();
		return dirtyEntityRecords.length > 0;
	}, []);

	const { post } = useSelect(
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

	const onConfirmNavigation = (url) => {
		if (hasDirtyRecords) {
			setConfirmUrl(url);
		} else {
			window.location.assign(url);
		}
	};

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
	const onSubmit = async () => {
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

			// check values.
			const values = await Promise.all(pendingSavedRecords);

			if (values.some((value) => typeof value === 'undefined')) {
				throw new Error('Saving failed.');
			}

			// fire save event.
			doAction('surecart.productSaved', product);

			// remove all args from the url.
			setBrowserURL({ id });

			// save success.
			createSuccessNotice(__('Product updated.', 'surecart'), {
				type: 'snackbar',
			});

			if (confirmUrl) {
				return window.location.assign(confirmUrl);
			}

			setSaving(false);
		} catch (e) {
			console.error(e);
			setError(e);
			setSaving(false);
		}
	};

	/**
	 * Toggle product delete.
	 */
	const onDeleteProduct = async () => {
		setError(null);
		try {
			await deleteProduct({ throwOnError: true });
		} catch (e) {
			// Known WP core-data quirk: the REMOVE_ITEMS reducer runs
			// `queryItems.itemIds.filter(...)` without a guard; an in-flight
			// `getEntityRecords` query can leave `itemIds` undefined and
			// throw TypeError *after* the API DELETE has already succeeded.
			// Tolerate that one error and run the success path; surface
			// anything else.
			const isReducerBug =
				e?.name === 'TypeError' &&
				/undefined.*filter/i.test(e?.message || '');
			if (!isReducerBug) {
				setError(e);
				return;
			}
		}

		createSuccessNotice(__('Product deleted.', 'surecart'), {
			type: 'snackbar',
		});

		// Navigate back to products list.
		if (navigation) {
			navigation.goToList();
		} else {
			window.location.href = addQueryArgs('admin.php', {
				page: 'sc-products',
			});
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
					/** Fix conflicts with spectra. */
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
							{...(navigation
								? {}
								: { href: 'admin.php?page=sc-products' })}
							onClick={backToList}
						>
							<sc-icon name="arrow-left"></sc-icon>
						</ScButton>
						<sc-breadcrumbs>
							<sc-breadcrumb>
								<Logo display="block" />
							</sc-breadcrumb>
							<sc-breadcrumb>
								<a
									href="admin.php?page=sc-products"
									onClick={(e) => {
										if (navigation) {
											e.preventDefault();
											backToList();
										}
									}}
									css={css`
										text-decoration: none;
										color: inherit;
										&:hover {
											text-decoration: underline;
										}
									`}
								>
									{__('Products', 'surecart')}
								</a>
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
							onSubmit={onSubmit}
							onToggleArchive={onToggleArchiveProduct}
							setConfirmUrl={setConfirmUrl}
							hasDirtyRecords={hasDirtyRecords}
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
						<Template
							product={product}
							post={post}
							updateProduct={editProduct}
							loading={!hasLoadedProduct}
						/>
						<Shipping
							product={product}
							updateProduct={editProduct}
							loading={!hasLoadedProduct}
						/>
						<Reviews
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

					<Media
						productId={id}
						product={product}
						updateProduct={editProduct}
					/>

					{post?.id && (
						<Editor
							onNavigate={onConfirmNavigation}
							post={post}
							loading={!hasLoadedProduct}
						/>
					)}

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

					<ProductOptions
						post={post}
						onNavigate={onConfirmNavigation}
					/>

					<ConfirmNavigation
						open={!!confirmUrl}
						loading={saving}
						onConfirm={onSubmit}
						onRequestClose={() => {
							setConfirmUrl(null);
						}}
					/>
				</Fragment>
			</UpdateModel>
		</>
	);
};
