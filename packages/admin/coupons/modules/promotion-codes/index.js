/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef, Fragment } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies.
 */
import Box from '../../../ui/Box';
import { ScBlockUi, ScButton, ScIcon } from '@surecart/components-react';
import EditPromotionCode from './EditPromotionCode';
import PrevNextButtons from '../../../ui/PrevNextButtons';
import PromotionCodesList from './PromotionCodesList';

export default ({ id }) => {
	const { createErrorNotice } = useDispatch(noticesStore);
	const [modal, setModal] = useState(false);
	const [activeTab, setActiveTab] = useState('active');

	// Active promotions.
	const [activePage, setActivePage] = useState(1);
	const [activePromotions, setActivePromotions] = useState([]);
	const [activeTotalCount, setActiveTotalCount] = useState(0);
	const [isLoadingActive, setIsLoadingActive] = useState(true);
	const [isBusyActive, setIsBusyActive] = useState(false);

	// Archived promotions.
	const [archivedPage, setArchivedPage] = useState(1);
	const [archivedPromotions, setArchivedPromotions] = useState([]);
	const [archivedTotalCount, setArchivedTotalCount] = useState(0);
	const [isLoadingArchived, setIsLoadingArchived] = useState(true);
	const [isBusyArchived, setIsBusyArchived] = useState(false);

	const perPage = 10;

	const fetchPromotions = async (
		archived,
		page,
		setPromotions,
		setTotalCount,
		setLoading,
		setBusy,
		currentPromotions
	) => {
		try {
			if (currentPromotions.length) {
				setBusy(true);
			} else {
				setLoading(true);
			}

			const response = await apiFetch({
				path: addQueryArgs('/surecart/v1/promotions', {
					coupon_ids: [id],
					archived,
					per_page: perPage,
					page,
				}),
				parse: false,
			});

			const data = await response.json();
			const total = parseInt(
				response.headers.get('X-WP-Total') || '0',
				10
			);

			setPromotions(data);
			setTotalCount(total);
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart')
			);
		} finally {
			setLoading(false);
			setBusy(false);
		}
	};

	const fetchActivePromotions = () => {
		fetchPromotions(
			false,
			activePage,
			setActivePromotions,
			setActiveTotalCount,
			setIsLoadingActive,
			setIsBusyActive,
			activePromotions
		);
	};

	const fetchArchivedPromotions = () => {
		fetchPromotions(
			true,
			archivedPage,
			setArchivedPromotions,
			setArchivedTotalCount,
			setIsLoadingArchived,
			setIsBusyArchived,
			archivedPromotions
		);
	};

	const refreshAll = () => {
		fetchActivePromotions();
		fetchArchivedPromotions();
	};

	// Track if it's the first render for pagination
	const isFirstActivePageRender = useRef(true);
	const isFirstArchivedPageRender = useRef(true);

	// Fetch both active and archived promotions in parallel on mount
	useEffect(() => {
		fetchActivePromotions();
		fetchArchivedPromotions();
	}, [id]);

	// Fetch active promotions when active page changes (skip first render)
	useEffect(() => {
		if (isFirstActivePageRender.current) {
			isFirstActivePageRender.current = false;
			return;
		}
		fetchActivePromotions();
	}, [activePage]);

	// Fetch archived promotions when archived page changes (skip first render)
	useEffect(() => {
		if (isFirstArchivedPageRender.current) {
			isFirstArchivedPageRender.current = false;
			return;
		}
		fetchArchivedPromotions();
	}, [archivedPage]);

	// Switch to active tab if archived becomes empty while on archived tab.
	useEffect(() => {
		if (
			activeTab === 'archived' &&
			archivedTotalCount === 0 &&
			!isLoadingArchived
		) {
			setActiveTab('active');
		}
	}, [archivedTotalCount, isLoadingArchived, activeTab]);

	const isLoading = isLoadingActive || isLoadingArchived;
	const isBusy = activeTab === 'active' ? isBusyActive : isBusyArchived;
	const hasArchivedPromotions = archivedTotalCount > 0;
	const showTabs = hasArchivedPromotions;

	const currentPromotions =
		activeTab === 'active' ? activePromotions : archivedPromotions;
	const currentTotalCount =
		activeTab === 'active' ? activeTotalCount : archivedTotalCount;
	const currentPage = activeTab === 'active' ? activePage : archivedPage;
	const setCurrentPage =
		activeTab === 'active' ? setActivePage : setArchivedPage;
	const hasPagination = currentTotalCount > perPage;

	const renderTabs = () => {
		if (!showTabs) {
			return null;
		}

		return (
			<div
				css={css`
					display: flex;
					gap: var(--sc-spacing-xx-small);
					margin-bottom: var(--sc-spacing-medium);
				`}
			>
				<button
					type="button"
					onClick={() => setActiveTab('active')}
					css={css`
						background: none;
						border: none;
						padding: var(--sc-spacing-small);
						font-size: var(--sc-font-size-medium);
						font-weight: ${activeTab === 'active' ? '600' : '400'};
						color: ${activeTab === 'active'
							? 'var(--sc-color-gray-800)'
							: 'var(--sc-color-gray-500)'};
						cursor: pointer;
						transition: all 0.2s ease;
					`}
				>
					{__('Active', 'surecart')} ({activeTotalCount})
				</button>
				<div
					css={css`
						height: 12px;
						width: 1px;
						align-self: center;
						background: var(--sc-color-gray-300);
					`}
				></div>
				<button
					type="button"
					onClick={() => setActiveTab('archived')}
					css={css`
						background: none;
						border: none;
						padding: var(--sc-spacing-small);
						font-size: var(--sc-font-size-medium);
						font-weight: ${activeTab === 'archived'
							? '600'
							: '400'};
						color: ${activeTab === 'archived'
							? 'var(--sc-color-gray-800)'
							: 'var(--sc-color-gray-500)'};
						cursor: pointer;
						transition: all 0.2s ease;
					`}
				>
					{__('Archived', 'surecart')} ({archivedTotalCount})
				</button>
			</div>
		);
	};

	const renderContent = () => {
		return (
			<>
				<PromotionCodesList
					promotions={currentPromotions}
					onUpdate={refreshAll}
					emptyIcon={activeTab === 'archived' ? 'archive' : 'tag'}
					emptyMessage={
						activeTab === 'archived'
							? __('No archived promotion codes.', 'surecart')
							: __('No promotion codes found.', 'surecart')
					}
				/>

				{hasPagination && (
					<div
						css={css`
							padding: var(--sc-spacing-medium);
						`}
					>
						<PrevNextButtons
							data={currentPromotions}
							page={currentPage}
							setPage={setCurrentPage}
							perPage={perPage}
							totalItems={currentTotalCount}
							loading={isBusy}
							justifyContent="center"
						/>
					</div>
				)}
			</>
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

	const title = showTabs
		? __('Promotion Codes', 'surecart')
		: `${__('Promotion Codes', 'surecart')}${
				!isLoading ? ` (${activeTotalCount})` : ''
		  }`;

	return (
		<Fragment>
			<Box title={title} loading={isLoading} footer={renderFooter()}>
				<div>
					{renderTabs()}
					{renderContent()}
					{!!isBusy && <ScBlockUi spinner />}
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
