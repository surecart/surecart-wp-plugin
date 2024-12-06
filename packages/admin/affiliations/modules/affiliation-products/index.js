/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore, useEntityRecords } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies.
 */
import PrevNextButtons from '../../../ui/PrevNextButtons';
import usePagination from '../../../hooks/usePagination';
import ProductsDataTable from '../../../components/data-tables/affiliates/products';
import CommissionForm from '../../../components/affiliates/commission/CommissionForm';
import useSave from '../../../settings/UseSave';
import EmptyCommissions from '../../../components/affiliates/commission/EmptyCommissions';
import GuideModal from '../../../components/affiliates/commission/GuideModal';
import Confirm from '../../../components/confirm';
import { ScButton, ScIcon } from '@surecart/components-react';

export default ({ affiliationId }) => {
	if (!affiliationId) {
		return null;
	}

	const [page, setPage] = useState(1);
	const [modal, setModal] = useState(false);
	const [error, setError] = useState(null);
	const [guide, setGuide] = useState(false);
	const perPage = 5;

	const { save } = useSave();
	const { editEntityRecord, saveEntityRecord, deleteEntityRecord } =
		useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const [saving, setSaving] = useState(false);
	const defaultAffiliationProduct = {
		commission_structure: {},
		product: '',
		affiliation: affiliationId,
	};

	const [affiliationProduct, setAffiliationProduct] = useState({
		...defaultAffiliationProduct,
	});

	const id = affiliationProduct?.id;

	// Run a selector to get the affiliation product data for edit.
	// So that we can use editEntityRecord to save the data.
	useSelect(
		(select) => {
			if (!id) {
				return {};
			}

			const entityData = ['surecart', 'affiliation-product', id];
			return {
				affiliationProductEdited: select(coreStore).getEntityRecord(
					...entityData
				),
			};
		},
		[id]
	);

	const onChange = async (data) => {
		setAffiliationProduct({
			...affiliationProduct,
			...data,

			commission_structure: {
				...affiliationProduct.commission_structure,
				...data?.commission_structure,
			},
		});
	};

	const onSubmit = async () =>
		affiliationProduct?.id ? await onEdit() : await onCreate();

	const {
		records: affiliationProducts,
		isResolving: loading,
		isResolving: fetching,
		totalItems,
	} = useEntityRecords(
		'surecart',
		'affiliation-product',
		{
			context: 'edit',
			affiliation_ids: [affiliationId],
			page,
			per_page: perPage,
			expand: ['commission_structure', 'product', 'product.prices'],
		},
		{
			enabled: true,
		}
	);

	const { hasPagination } = usePagination({
		data: affiliationProducts || [],
		page,
		perPage,
		totalItems,
	});

	const onCreate = async () => {
		try {
			setError(null);
			setSaving(true);

			await saveEntityRecord(
				'surecart',
				'affiliation-product',
				affiliationProduct,
				{
					throwOnError: true,
				}
			);

			createSuccessNotice(
				__('Affiliate product commission created.', 'surecart'),
				{
					type: 'snackbar',
				}
			);

			setModal(false);
		} catch (error) {
			console.error('error', error);
			setError(error);
		} finally {
			setSaving(false);
		}
	};

	const onEdit = async () => {
		try {
			setError(null);
			setSaving(true);

			await editEntityRecord(
				'surecart',
				'affiliation-product',
				affiliationProduct?.id,
				affiliationProduct
			);

			await save({
				successMessage: __(
					'Affiliate product commission updated.',
					'surecart'
				),
			});

			setModal(false);
		} catch (error) {
			console.error('error', error);
			setError(error);
		} finally {
			setSaving(false);
		}
	};

	const onDelete = async () => {
		try {
			setSaving(true);

			await deleteEntityRecord(
				'surecart',
				'affiliation-product',
				affiliationProduct?.id,
				undefined,
				{
					throwOnError: true,
				}
			);

			createSuccessNotice(__('Affiliate product deleted.', 'surecart'), {
				type: 'snackbar',
			});

			setModal(false);
		} catch (e) {
			setError(e);
			console.error(e);
		} finally {
			setSaving(false);
		}
	};

	const openCreateModal = () => {
		setAffiliationProduct(defaultAffiliationProduct);
		setModal('create');
	};

	const openEditModal = (value) => {
		setAffiliationProduct(value);
		setModal('edit');
	};

	const openDeleteModal = (affiliationProductId) => {
		setAffiliationProduct({ id: affiliationProductId });
		setModal('delete');
	};

	const onDeleted = () => {
		setModal(false);
		setPage(1);
	};

	const productTitleRender = () => {
		return (
			<>
				{__('Product Commissions', 'surecart')}

				<ScButton
					onClick={() => setGuide(true)}
					size="small"
					circle
					type="text"
				>
					<sc-icon
						name="help-circle"
						style={{ fontSize: '14px', opacity: '0.65' }}
					></sc-icon>
				</ScButton>
			</>
		);
	};

	return (
		<>
			<ProductsDataTable
				title={productTitleRender()}
				columns={{
					product: {
						label: __('Product', 'surecart'),
						width: '200px',
					},
					commission_amount: {
						label: __('Commission Amount', 'surecart'),
					},
					subscription_commission: {
						label: __('Subscription Commission', 'surecart'),
					},
					lifetime_commission: {
						label: __('Lifetime Commission', 'surecart'),
					},
					action: {
						label: __('', 'surecart'),
						width: '80px',
					},
				}}
				data={affiliationProducts}
				isLoading={loading}
				isFetching={fetching}
				perPage={perPage}
				page={page}
				setPage={setPage}
				empty={
					<EmptyCommissions
						message={__(
							'Add a product-specific commission for this affiliate.',
							'surecart'
						)}
						openModal={openCreateModal}
					/>
				}
				footer={
					(affiliationProducts || []).length > 0 ? (
						<ScButton onClick={openCreateModal}>
							<ScIcon name="plus" slot="prefix"></ScIcon>
							{__('Add Commission', 'surecart')}
						</ScButton>
					) : null
				}
				setAffiliationProduct={openEditModal}
				onDelete={openDeleteModal}
			>
				{hasPagination && (
					<div>
						<div
							css={css`
								margin: 0 var(--sc-spacing-xx-large)
									var(--sc-spacing-large)
									var(--sc-spacing-xx-large);
							`}
						>
							<PrevNextButtons
								data={affiliationProducts}
								page={page}
								setPage={setPage}
								perPage={perPage}
								loading={fetching}
							/>
						</div>
					</div>
				)}
			</ProductsDataTable>

			<CommissionForm
				title={
					affiliationProduct?.id
						? __('Edit Product Commission', 'surecart')
						: __('New Product Commission', 'surecart')
				}
				submitButtonTitle={
					affiliationProduct?.id
						? __('Save', 'surecart')
						: __('Create', 'surecart')
				}
				hasProduct={true}
				error={error}
				open={modal === 'create' || modal === 'edit'}
				id={affiliationProduct?.id}
				onRequestClose={() => setModal(false)}
				onSubmit={onSubmit}
				onChange={onChange}
				affiliationItem={affiliationProduct}
				loading={saving || loading}
			/>

			<Confirm
				open={modal === 'delete'}
				onRequestClose={() => setModal(false)}
				error={error}
				loading={saving || loading}
				onConfirm={onDelete}
			>
				{__('Are you sure? This cannot be undone.', 'surecart')}
			</Confirm>

			<GuideModal
				open={guide}
				onRequestClose={() => setGuide(false)}
				title={__('Affiliate product commissions', 'surecart')}
				description={
					<>
						<p>
							{__(
								'This setting will overwrite any other comission settings for the affiliate and product.',
								'surecart'
							)}
						</p>
						<p>
							<strong>{__('Priority', 'surecart')}</strong>
						</p>
						<ol>
							<li>
								{__(
									'Global Affiliate Commissions (Lowest)',
									'surecart'
								)}
							</li>
							<li>
								{__(
									'Individual Affiliate Commissions',
									'surecart'
								)}
							</li>
							<li>
								{__(
									'Individual Product Commissions',
									'surecart'
								)}
							</li>
							<li>
								<strong
									style={{
										color: 'var(--sc-color-primary-500)',
									}}
								>
									{__(
										'Individual Affiliate Product Commissions (Highest)',
										'surecart'
									)}
								</strong>
							</li>
						</ol>
					</>
				}
			/>
		</>
	);
};
