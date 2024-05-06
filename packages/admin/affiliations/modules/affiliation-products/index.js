/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies.
 */
import PrevNextButtons from '../../../ui/PrevNextButtons';
import usePagination from '../../../hooks/usePagination';
import ProductsDataTable from '../../../components/data-tables/affiliates/products';
import CommissionForm from '../../../components/affiliates/commission/CommissionForm';
import useSave from '../../../settings/UseSave';
import ConfirmDelete from './ConfirmDelete';
import EmptyCommissions from '../../../components/affiliates/commission/EmptyCommissions';
import { ScButton, ScIcon } from '@surecart/components-react';

export default ({ affiliationId }) => {
	if (!affiliationId) {
		return null;
	}

	const [page, setPage] = useState(1);
	const [modal, setModal] = useState(false);
	const [error, setError] = useState(null);
	const perPage = 5;

	const { save } = useSave();
	const { editEntityRecord, saveEntityRecord } = useDispatch(coreStore);
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

	const { affiliationProducts, loading, fetching } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'affiliation-product',
				{
					context: 'edit',
					affiliation_ids: [affiliationId],
					page,
					per_page: perPage,
					expand: [
						'commission_structure',
						'product',
						'product.prices',
					],
				},
			];
			const affiliationProducts =
				select(coreStore).getEntityRecords(...queryArgs) || [];
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);

			return {
				affiliationProducts,
				loading: loading && page === 1,
				fetching: loading && page !== 1,
			};
		},
		[affiliationId, page]
	);

	const { hasPagination } = usePagination({
		data: affiliationProducts,
		page,
		perPage,
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

	return (
		<>
			<ProductsDataTable
				title={__('Product Commissions', 'surecart')}
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
					affiliationProducts.length > 0 ? (
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

			<ConfirmDelete
				open={modal === 'delete'}
				onRequestClose={() => setModal(false)}
				affiliationId={affiliationId}
				affiliationProductId={affiliationProduct?.id}
			/>
		</>
	);
};
