/**
 * External dependencies.
 */
import { sprintf, __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState, Fragment } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import {
	ScBlockUi,
	ScButton,
	ScFlex,
	ScIcon,
	ScSwitch,
} from '@surecart/components-react';
import Code from './Code';
import EditPromotionCode from './EditPromotionCode';
import PrevNextButtons from '../../ui/PrevNextButtons';
import usePagination from '../../hooks/usePagination';

export default ({ id }) => {
	const [showArchived, setShowArchived] = useState(false);
	const [modal, setModal] = useState(false);
	const [activePage, setActivePage] = useState(1);
	const [archivedPage, setArchivedPage] = useState(1);
	const perPage = 10;

	const { promotions, archivedPromotions, isLoading, isBusy } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'promotion',
				{
					coupon_ids: [id],
					per_page: 100,
				},
			];
			const promotions = select(coreStore).getEntityRecords(...queryArgs);
			const resolving = select(coreStore).isResolving(
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
				isLoading: !promotions?.length && resolving,
				isBusy: promotions?.length && resolving,
			};
		}
	);

	// Paginate active promotions
	const paginatedActivePromotions = (promotions || []).slice(
		(activePage - 1) * perPage,
		activePage * perPage
	);

	// Paginate archived promotions
	const paginatedArchivedPromotions = (archivedPromotions || []).slice(
		(archivedPage - 1) * perPage,
		archivedPage * perPage
	);

	// Calculate pagination states
	const { hasPagination: hasActivePagination } = usePagination({
		data: paginatedActivePromotions,
		page: activePage,
		perPage,
		totalItems: promotions?.length,
	});

	const { hasPagination: hasArchivedPagination } = usePagination({
		data: paginatedArchivedPromotions,
		page: archivedPage,
		perPage,
		totalItems: archivedPromotions?.length,
	});

	return (
		<Box
			title={__('Promotion Codes', 'surecart')}
			loading={isLoading}
			footer={
				!isLoading && (
					<Fragment>
						<ScFlex style={{ width: '100%' }} direction="column" gap={16}>
							<ScFlex
								style={{ width: '100%' }}
								justifyContent="space-between"
								alignItems="center"
							>
								<ScButton onClick={() => setModal(true)}>
									<ScIcon slot="prefix" name="plus" />
									{__('Add Promotion Code', 'surecart')}
								</ScButton>
								{!!archivedPromotions?.length && (
									<ScSwitch
										checked={!!showArchived}
										onClick={(e) => {
											e.preventDefault();
											setShowArchived(!showArchived);
											if (!showArchived) {
												setArchivedPage(1);
											}
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
								)}
							</ScFlex>
							{!showArchived && hasActivePagination && (
								<PrevNextButtons
									data={paginatedActivePromotions}
									page={activePage}
									setPage={setActivePage}
									perPage={perPage}
									loading={isBusy}
								/>
							)}
						</ScFlex>
					</Fragment>
				)
			}
		>
			{paginatedActivePromotions.map((promotion) => (
				<Code promotion={promotion} key={promotion?.id} />
			))}

			{!!showArchived &&
				paginatedArchivedPromotions.map((promotion) => (
					<Code promotion={promotion} key={promotion?.id} />
				))}

			{!!showArchived && hasArchivedPagination && (
				<PrevNextButtons
					data={paginatedArchivedPromotions}
					page={archivedPage}
					setPage={setArchivedPage}
					perPage={perPage}
					loading={isBusy}
				/>
			)}

			{!!modal && (
				<EditPromotionCode
					couponId={id}
					onRequestClose={() => setModal(false)}
				/>
			)}

			{!!isBusy && <ScBlockUi spinner />}
		</Box>
	);
};
