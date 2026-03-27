/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect, Fragment } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { Button } from '@wordpress/components';
/**
 * Internal dependencies.
 */
import Box from '../../../ui/Box';
import {
	ScButton,
	ScIcon,
	ScSkeleton,
	ScTag,
} from '@surecart/components-react';
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
			const isResolving = select(coreStore).isResolving(
				'getEntityRecords',
				activeQueryArgs
			);

			return {
				activePromotions: select(coreStore).getEntityRecords(
					...activeQueryArgs
				),
				isLoadingActive: isResolving && activePage === 1,
				isBusyActive: isResolving && activePage !== 1,
				totalActiveItems: select(coreStore).getEntityRecordsTotalItems(
					...activeQueryArgs
				),
			};
		},
		[id, activePage]
	);

	const {
		archivedPromotions,
		isLoadingArchived,
		isBusyArchived,
		totalArchivedItems,
	} = useSelect(
		(select) => {
			const isResolving = select(coreStore).isResolving(
				'getEntityRecords',
				archivedQueryArgs
			);

			return {
				archivedPromotions: select(coreStore).getEntityRecords(
					...archivedQueryArgs
				),
				isLoadingArchived: isResolving && archivedPage === 1,
				isBusyArchived: isResolving && archivedPage !== 1,
				totalArchivedItems: select(
					coreStore
				).getEntityRecordsTotalItems(...archivedQueryArgs),
			};
		},
		[id, archivedPage]
	);

	const refreshAll = () => {
		if (isActive) {
			invalidateResolution('getEntityRecords', activeQueryArgs);
		} else {
			invalidateResolution('getEntityRecords', archivedQueryArgs);
		}
	};

	// Switch to active tab when archived becomes empty.
	useEffect(() => {
		if (
			!isActive &&
			!isLoadingArchived &&
			archivedPromotions?.length === 0
		) {
			setIsActive(true);
		}
	}, [isActive, isLoadingArchived, archivedPromotions]);

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
					min-width: unset !important;
				`}
			>
				<Button
					variant="tertiary"
					size="compact"
					label={__('Show active promotion codes', 'surecart')}
					showTooltip={true}
					onClick={() => {
						setIsActive(true);
						setActivePage(1);
					}}
					css={css`
						color: ${isActive
							? 'var(--sc-color-gray-800) !important'
							: 'var(--sc-color-gray-500) !important'};
						font-weight: ${isActive ? '600' : '400'};
						padding: var(--sc-spacing-xx-small)
							var(--sc-spacing-small);
						display: flex;
						align-items: center;
						gap: var(--sc-spacing-xx-small);
					`}
					role="tab"
				>
					{__('Active', 'surecart')}{' '}
					{!isLoadingActive && (
						<ScTag size="small" pill>
							{totalActiveItems}
						</ScTag>
					)}
				</Button>

				<Button
					variant="tertiary"
					size="compact"
					showTooltip={true}
					label={__('Show archived promotion codes', 'surecart')}
					onClick={() => {
						setIsActive(false);
						setArchivedPage(1);
					}}
					css={css`
						color: ${!isActive
							? 'var(--sc-color-gray-800) !important'
							: 'var(--sc-color-gray-500) !important'};
						font-weight: ${!isActive ? '600' : '400'};
						padding: var(--sc-spacing-xx-small)
							var(--sc-spacing-small);
						display: flex;
						align-items: center;
						gap: var(--sc-spacing-xx-small);
					`}
					role="tab"
				>
					{__('Archived', 'surecart')}{' '}
					{!isLoadingArchived && (
						<ScTag size="small" pill>
							{totalArchivedItems}
						</ScTag>
					)}
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
			<Box
				title={title}
				loading={isLoading}
				footer={renderFooter()}
				header_action={renderTabs()}
			>
				<div>
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
