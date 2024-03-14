/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState, Fragment } from '@wordpress/element';
import { Modal } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies.
 */
import { ScButton, ScFlex, ScIcon, ScSwitch } from '@surecart/components-react';
import PrevNextButtons from '../../ui/PrevNextButtons';
import PromotionsDataTable from '../../components/data-tables/PromotionsDataTable';
import usePagination from '../../hooks/usePagination';
import EditPromotionCode from './EditPromotionCode';

export default ({ id }) => {
	const [showArchived, setShowArchived] = useState(false);
	const [promotion, setPromotion] = useState(null);
	const [modal, setModal] = useState(false);
	const [page, setPage] = useState(1);
	const perPage = 100;

	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);
	const { editEntityRecord, saveEntityRecord, deleteEntityRecord } =
		useDispatch(coreStore);

	const {
		promotions,
		archivedPromotions,
		loading,
		fetching,
		isDeleting,
		isBusy,
	} = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'promotion',
				{
					coupon_ids: [id],
					page,
					per_page: perPage,
					expand: ['affiliation', 'customer'],
				},
			];
			const promotions = select(coreStore).getEntityRecords(...queryArgs);
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);

			return {
				promotions: (promotions || []).filter(
					(promotion) => !promotion.archived
				),
				archivedPromotions: (promotions || []).filter(
					(promotion) => promotion.archived
				),
				loading: loading && page === 1,
				fetching: loading && page !== 1,
				isBusy: promotions?.length && loading,
				isDeleting: select(coreStore)?.isDeletingEntityRecord?.(
					...queryArgs
				),
			};
		},
		[id, page]
	);

	const allPromotions = showArchived
		? [...promotions, ...archivedPromotions]
		: promotions;

	const { hasPagination } = usePagination({
		data: allPromotions,
		page,
		perPage,
	});

	const promotionId = promotion?.id || null;
	console.log('promotionId', promotionId)

	const updatePromotion = (data) =>
		editEntityRecord('surecart', 'promotion', promotionId, data);

	const onArchive = async () => {
		try {
			const saved = await saveEntityRecord('surecart', 'promotion', {
				id: promotionId,
				archived: !promotion?.archived,
			});
			createSuccessNotice(
				saved?.archived
					? __('Archived.', 'surecart')
					: __('Restored.', 'surecart'),
				{
					type: 'snackbar',
				}
			);
		} catch (e) {
			console.error(e);
		}
	};

	const deletePromotion = async () => {
		try {
			await deleteEntityRecord('surecart', 'promotion', promotionId, {
				throwOnError: true,
			});
			createSuccessNotice(__('Deleted.', 'surecart'), {
				type: 'snackbar',
			});
			setModal(false);
		} catch (e) {
			console.error(e);
			createErrorNotice(e);
		} finally {

		}
	};

	return (
		<PromotionsDataTable
			title={__('Promotion Codes', 'surecart')}
			columns={{
				code: {
					label: __('Code', 'surecart'),
					width: '200px',
				},
				customer: {
					label: __('Customer', 'surecart'),
				},
				affiliation: {
					label: __('Affiliate', 'surecart'),
				},
				times_redeemed: {
					label: __('Total Uses', 'surecart'),
				},
				action: {
					width: '100px',
				},
			}}
			data={allPromotions}
			isLoading={loading || isBusy}
			isFetching={fetching}
			perPage={perPage}
			page={page}
			setPage={setPage}
			setModal={setModal}
			setPromotion={setPromotion}
			onArchive={onArchive}
			updatePromotion={updatePromotion}
			empty={
				page > 1
					? __('No more promotions.', 'surecart')
					: __('None found.', 'surecart')
			}
			footer={
				<>
					{/* <ScFlex justifyContent="space-between"> */}
					<ScButton onClick={() => setModal('create')}>
						<ScIcon slot="prefix" name="plus" />
						{__('Add Promotion Code', 'surecart')}
					</ScButton>
					{!!archivedPromotions?.length && (
						<div>
							<ScFlex justifyContent="flex-end">
								<ScSwitch
									checked={!!showArchived}
									onClick={(e) => {
										e.preventDefault();
										setShowArchived(!showArchived);
									}}
								>
									{sprintf(
										!showArchived
											? __(
													'Show %d Archived Promotion Codes',
													'surecart'
											  )
											: __(
													'Hide %d Archived Promotion Codes',
													'surecart'
											  ),
										archivedPromotions?.length
									)}
								</ScSwitch>
							</ScFlex>
						</div>
					)}
					{/* </ScFlex> */}

					{hasPagination && (
						<div>
							<PrevNextButtons
								data={allPromotions}
								page={page}
								setPage={setPage}
								perPage={perPage}
								loading={fetching}
							/>
						</div>
					)}

					{modal === 'create' && (
						<EditPromotionCode
							couponId={id}
							onRequestClose={() => setModal(false)}
						/>
					)}

					{modal === 'edit' && (
						<EditPromotionCode
							couponId={id}
							promotion={promotion}
							onRequestClose={() => setModal(null)}
						/>
					)}

					{modal === 'delete' && (
						<Modal
							title={__(
								'Delete this promotion code?',
								'surecart'
							)}
							css={css`
								max-width: 500px !important;
							`}
							onRequestClose={() => setModal(false)}
							shouldCloseOnClickOutside={false}
						>
							<p>
								{__(
									'Are you sure you want to delete this promotion code?',
									'surecart'
								)}
							</p>
							<ScFlex alignItems="center">
								<ScButton
									type="primary"
									busy={isBusy | isDeleting}
									onClick={deletePromotion}
								>
									{__('Delete', 'surecart')}
								</ScButton>
								<ScButton
									type="text"
									onClick={() => setModal(false)}
								>
									{__('Cancel', 'surecart')}
								</ScButton>
							</ScFlex>
						</Modal>
					)}
				</>
			}
		/>
	);
};
