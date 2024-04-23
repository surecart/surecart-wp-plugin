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
import PrevNextButtons from '../../ui/PrevNextButtons';
import usePagination from '../../hooks/usePagination';
import ProductsDataTable from '../../components/data-tables/affiliates/products';
import { ScButton, ScIcon } from '@surecart/components-react';
import ProductCommissionDrawerForm from '../../components/affiliates/commission/ProductCommissionDrawerForm';
import useSave from '../../settings/UseSave';
import Error from '../../components/Error';

export default ({ affiliationId }) => {
	if (!affiliationId) {
		return null;
	}

	const [page, setPage] = useState(1);
	const [modal, setModal] = useState(false);
	const [error, setError] = useState(null);
	const perPage = 5;

	const { save } = useSave();
	const { saveEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const [affiliationProduct, setAffiliationProduct] = useState({
		commission_structure: {},
		product: '',
		affiliation: affiliationId,
	});

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

	const { affiliation_product, isLoading } = useSelect((select) => {
		if (!affiliationProduct.id) {
			return {
				isLoading: false,
				affiliation_product: null,
			};
		}

		const entityData = [
			'surecart',
			'affiliation-product',
			affiliationProduct.id,
		];

		return {
			affiliation_product: select(coreStore).getEditedEntityRecord(
				...entityData
			),
			isLoading: select(coreStore)?.isResolving?.(
				'getEditedEntityRecord',
				[...entityData]
			),
		};
	});

	const saveAffiliationProduct = async (data) => {
		try {
			if (data.id) {
				save({
					successMessage: __(
						'Affiliate product commission updated.',
						'surecart'
					),
				});
			} else {
				const affiliationProductCreated = await saveEntityRecord(
					'surecart',
					'affiliation-product',
					data,
					{ throwOnError: true }
				);

				if (affiliationProductCreated?.id) {
					createSuccessNotice(
						__('Affiliate product commission created.', 'surecart'),
						{
							type: 'snackbar',
						}
					);
				}
			}

			setModal(false);
		} catch (error) {
			console.error('error', error);
			setError(error);
		}
	};

	return (
		<>
			<Error error={error} setError={setError} />

			<ProductsDataTable
				title={__('Products', 'surecart')}
				columns={{
					product: {
						label: __('Product', 'surecart'),
						width: '200px',
					},
					discount_amount: {
						label: __('Discount Amount', 'surecart'),
					},
					subscription_commision: {
						label: __('Subscription Commission', 'surecart'),
					},
					lifetime_commision: {
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
					page > 1
						? __('No more products.', 'surecart')
						: __('None found.', 'surecart')
				}
				headerAction={
					<div
						css={css`
							margin: -12px 5px;
						`}
					>
						<ScButton
							type="link"
							onClick={() => setModal(true)}
							disabled={loading}
						>
							<ScIcon name="plus" slot="prefix" />
							{__('Add Commission', 'surecart')}
						</ScButton>
					</div>
				}
				footer={
					hasPagination && (
						<PrevNextButtons
							data={affiliationProducts}
							page={page}
							setPage={setPage}
							perPage={perPage}
							loading={fetching}
						/>
					)
				}
				setAffiliationProduct={setAffiliationProduct}
			/>

			<ProductCommissionDrawerForm
				title={
					affiliationProduct?.id
						? __('Edit Product Commission', 'surecart')
						: __('New Product Commission', 'surecart')
				}
				id={affiliationProduct?.id}
				open={!!modal}
				onRequestClose={() => setModal(false)}
				saveAffiliationProduct={saveAffiliationProduct}
				affiliationProduct={affiliationProduct}
				setAffiliationProduct={setAffiliationProduct}
			/>
		</>
	);
};
