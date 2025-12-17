/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState, Fragment } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import Box from '../../../ui/Box';
import { ScButton, ScIcon, ScSkeleton } from '@surecart/components-react';
import EditPromotionCode from './EditPromotionCode';
import PrevNextButtons from '../../../ui/PrevNextButtons';
import PromotionCodesList from './PromotionCodesList';
import usePagination from '../../../hooks/usePagination';

export default ({ id }) => {
	const [modal, setModal] = useState(false);
	const [isActive, setIsActive] = useState(true);
	const [activePage, setActivePage] = useState(1);
	const [archivedPage, setArchivedPage] = useState(1);
	const { invalidateResolution } = useDispatch(coreStore);
	const perPage = 10;

	// Active promotions query args.
	const activeQueryArgs = [
		'surecart',
		'promotion',
		{
			coupon_ids: [id],
			archived: false,
			per_page: perPage,
			page: activePage,
		},
	];

	// Archived promotions query args.
	const archivedQueryArgs = [
		'surecart',
		'promotion',
		{
			coupon_ids: [id],
			archived: true,
			per_page: perPage,
			page: archivedPage,
		},
	];

	const {
		activePromotions,
		isLoadingActive,
		isBusyActive,
		totalActiveItems,
	} = useSelect(
		(select) => {
			const isResolvingActive = select(coreStore).isResolving(
				'getEntityRecords',
				activeQueryArgs
			);

			return {
				activePromotions: select(coreStore).getEntityRecords(
					...activeQueryArgs
				),
				isLoadingActive: isResolvingActive && activePage === 1,
				isBusyActive: isResolvingActive && activePage !== 1,
				totalActiveItems: select(coreStore).getEntityRecordsTotalItems(
					...activeQueryArgs
				),
			};
		},
		[id, activePage, archivedPage]
	);

	const {
		archivedPromotions,
		isLoadingArchived,
		isBusyArchived,
		totalArchivedItems,
	} = useSelect(
		(select) => {
			const isResolvingArchived = select(coreStore).isResolving(
				'getEntityRecords',
				archivedQueryArgs
			);

			return {
				archivedPromotions: select(coreStore).getEntityRecords(
					...archivedQueryArgs
				),
				isLoadingArchived: isResolvingArchived && archivedPage === 1,
				isBusyArchived: isResolvingArchived && archivedPage !== 1,
				totalArchivedItems: select(
					coreStore
				).getEntityRecordsTotalItems(...archivedQueryArgs),
			};
		},
		[id, activePage, archivedPage]
	);

	const refreshAll = () => {
		invalidateResolution('getEntityRecords', activeQueryArgs);
		invalidateResolution('getEntityRecords', archivedQueryArgs);
	};

	const { hasPagination: hasActivePagination } = usePagination({
		data: activePromotions,
		page: activePage,
		perPage,
		totalItems: totalActiveItems,
	});

	const { hasPagination: hasArchivedPagination } = usePagination({
		data: archivedPromotions,
		page: archivedPage,
		perPage,
		totalItems: totalArchivedItems,
	});

	const isLoading = isLoadingActive || isLoadingArchived;
	const isBusy = isBusyActive || isBusyArchived;
	const hasArchivedPromotions =
		archivedPromotions?.length > 0 || archivedPage > 1;
	const showTabs = hasArchivedPromotions;

	const currentPromotions = isActive ? activePromotions : archivedPromotions;
	const currentPage = isActive ? activePage : archivedPage;
	const setCurrentPage = isActive ? setActivePage : setArchivedPage;
	const hasPagination = isActive
		? hasActivePagination
		: hasArchivedPagination;

	const renderTabs = () => {
		if (!showTabs) {
			return null;
		}

		return (
			<div
				css={css`
					display: flex;
					gap: var(--sc-spacing-medium);
					margin-bottom: var(--sc-spacing-medium);
				`}
			>
				<Button
					variant="tertiary"
					onClick={() => {
						setIsActive(true);
						setActivePage(1);
					}}
					css={css`
						color: ${isActive
							? 'var(--sc-color-gray-800) !important'
							: 'var(--sc-color-gray-500) !important'};
						font-weight: ${isActive ? '600' : '400'};
						padding: var(--sc-spacing-xx-small) 0;
					`}
					role="tab"
				>
					{__('Active', 'surecart')}{' '}
					{!isLoadingActive && `(${totalActiveItems})`}
				</Button>
				<div
					css={css`
						height: 12px;
						width: 1px;
						align-self: center;
						background: var(--sc-color-gray-300);
					`}
				></div>
				<Button
					variant="tertiary"
					onClick={() => {
						setIsActive(false);
						setArchivedPage(1);
					}}
					css={css`
						color: ${!isActive
							? 'var(--sc-color-gray-800) !important'
							: 'var(--sc-color-gray-500) !important'};
						font-weight: ${!isActive ? '600' : '400'};
						padding: var(--sc-spacing-xx-small) 0;
					`}
					role="tab"
				>
					{__('Archived', 'surecart')}{' '}
					{!isLoadingArchived && `(${totalArchivedItems})`}
				</Button>
			</div>
		);
	};

	const renderFooter = () => {
		if (isLoading) {
			return null;
		}

		return (
			<ScButton onClick={() => setModal(true)}>
				<ScIcon slot="prefix" name="plus" />
				{__('Add Promotion Code', 'surecart')}
			</ScButton>
		);
	};

	const title = hasArchivedPromotions
		? __('Promotion Codes', 'surecart')
		: `${__('Promotion Codes', 'surecart')}${
				!isLoading ? ` (${totalActiveItems ?? '0'})` : ''
		  }`;

	return (
		<Fragment>
			<Box title={title} loading={isLoading} footer={renderFooter()}>
				<div>
					{renderTabs()}

					<PromotionCodesList
						promotions={currentPromotions}
						onUpdate={refreshAll}
						emptyIcon={!isActive ? 'archive' : 'tag'}
						emptyMessage={
							!isActive
								? __('No archived promotion codes.', 'surecart')
								: __('No promotion codes found.', 'surecart')
						}
						loading={isBusy}
					/>

					{!!isBusy && (
						<div
							css={css`
								display: grid;
								gap: 0.5em;
								padding: var(--sc-drawer-body-spacing);
							`}
						>
							<ScSkeleton style={{ width: '100%' }}></ScSkeleton>
							<ScSkeleton style={{ width: '40%' }}></ScSkeleton>
						</div>
					)}

					{hasPagination && (
						<div
							css={css`
								margin-top: var(--sc-spacing-medium);
								padding: var(--sc-spacing-medium);
							`}
						>
							<PrevNextButtons
								data={currentPromotions}
								page={currentPage}
								setPage={setCurrentPage}
								perPage={perPage}
								loading={isBusy}
								justifyContent="center"
							/>
						</div>
					)}
				</div>
			</Box>

			{!!modal && (
				<EditPromotionCode
					couponId={id}
					onRequestClose={() => setModal(false)}
					onSuccess={refreshAll}
				/>
			)}
		</Fragment>
	);
};
