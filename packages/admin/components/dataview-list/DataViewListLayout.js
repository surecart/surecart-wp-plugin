/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useEffect, useRef } from '@wordpress/element';
import { DataViews } from '@wordpress/dataviews/wp';
import { Spinner } from '@wordpress/components';
import { InterfaceSkeleton, FullscreenMode } from '@wordpress/interface';
import { useViewportMatch } from '@wordpress/compose';
import Notifications from '../Notifications';
import EnhancedViewToggle from './EnhancedViewToggle';
import useEnhancedView from './useEnhancedView';
import useHorizontalScrollState from './useHorizontalScrollState';

export default ({
	header,
	pageHeader,
	tabs,
	statusSidebar,
	className = '',
	data,
	fields,
	view,
	onChangeView,
	paginationInfo,
	actions,
	isLoading,
	isMutating = false,
	defaultLayouts,
	enhancedViewControl = true,
	...rest
}) => {
	const { enabled, toggle } = useEnhancedView();
	const listRootRef = useRef(null);
	useHorizontalScrollState(listRootRef);

	// Reset scroll when the page number changes — pagination lives in the
	// footer, so without this the user lands at the bottom of the new page.
	// Also fires on DataViews' automatic page-reset when search/filters
	// change (desirable: new result set → top). Seeded with the initial page
	// so a deep-linked `paged=3` first paint doesn't scroll.
	const previousPageRef = useRef(view?.page);
	useEffect(() => {
		const page = view?.page || 1;
		if ((previousPageRef.current || 1) === page) {
			return;
		}
		previousPageRef.current = page;

		// The scroller differs by mode (see dataview-list-common.scss);
		// scrollTo on a non-scrollable element is a no-op, so reset every
		// candidate instead of detecting the active one.
		const root = listRootRef.current;
		root?.querySelector('.dataviews-wrapper')?.scrollTo(0, 0);
		root?.querySelector(
			'.interface-interface-skeleton__content'
		)?.scrollTo(0, 0);
		document.getElementById('wpcontent')?.scrollTo(0, 0);
		window.scrollTo(0, 0);
	}, [view?.page]);

	// Workspace shell only fits tablet-and-up; force off-mode below.
	const isLargeViewport = useViewportMatch('medium');
	const showWorkspace = enabled && isLargeViewport;

	// Refetches keep the previous (stale) rows on screen — see
	// useDataViewState — so give them the same dimmed-overlay treatment as
	// mutations instead of upstream's bare table swap.
	const showOverlay = isMutating || (isLoading && !!data?.length);

	const headerWithToggle = (
		<div
			css={css`
				display: flex;
				align-items: center;
				justify-content: flex-end;
				gap: 8px;
			`}
		>
			{header}
			{enhancedViewControl && isLargeViewport ? (
				<EnhancedViewToggle enabled={enabled} onToggle={toggle} />
			) : null}
		</div>
	);

	const tableShell = (
		<div
			css={css`
				position: relative;
			`}
		>
			{tabs && !showWorkspace ? <div>{tabs}</div> : null}
			<DataViews
				data={data}
				fields={fields}
				view={view}
				onChangeView={onChangeView}
				paginationInfo={paginationInfo}
				actions={actions}
				isLoading={isLoading}
				defaultLayouts={
					defaultLayouts || {
						table: {},
					}
				}
				supportedLayouts={['table']}
				header={headerWithToggle}
				search
				{...rest}
			/>

			{showOverlay && (
				<div
					css={css`
						position: absolute;
						inset: 0;
						background: rgba(255, 255, 255, 0.4);
						z-index: 10;
					`}
				>
					{/* Off-mode the overlay spans the full table scroll width;
					    a sticky scrollport-wide strip keeps the spinner in view. */}
					<div
						css={css`
							position: sticky;
							inset-inline-start: 0;
							width: min(var(--sc-dvw-viewport-w, 100%), 100%);
							height: 100%;
							display: flex;
							align-items: center;
							justify-content: center;
						`}
					>
						<Spinner style={{ width: '28px', height: '28px' }} />
					</div>
				</div>
			)}
		</div>
	);

	if (statusSidebar && showWorkspace) {
		return (
			<div
				ref={listRootRef}
				className={`sc-dataview-list-wrapper ${className}`.trim()}
				data-enhanced-view="on"
			>
				<FullscreenMode isActive />
				<InterfaceSkeleton
					className="sc-workspace-skeleton"
					/* `secondarySidebar` is the LEFT panel slot (Block
					   Library / Site Editor nav). `sidebar` is the RIGHT
					   Settings panel — using it would render the rail on
					   the right edge in LTR. */
					secondarySidebar={statusSidebar}
					content={
						/* Site Editor "frame canvas" — a dark inset frames a
						   rounded white canvas. The dark frame stays fixed
						   at the viewport edges; only the inner canvas
						   scrolls. Achieved with a flex column where the
						   white card fills the remaining height and clips
						   its overflow so the scrollbar sits inside the
						   rounded corners, not on the body. */
						<div
							css={css`
								padding: 16px;
								background: #1e1e1e;
								height: 100%;
								box-sizing: border-box;
								display: flex;
								flex-direction: column;
							`}
						>
							<div
								css={css`
									background: #fff;
									border-radius: 8px;
									flex: 1 1 auto;
									min-height: 0;
									overflow: hidden;
									box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06);
									box-sizing: border-box;
								`}
							>
								{pageHeader}
								{tableShell}
							</div>
						</div>
					}
				/>
				<Notifications />
			</div>
		);
	}

	return (
		<div
			ref={listRootRef}
			className={`sc-dataview-list-wrapper ${className}`.trim()}
			data-enhanced-view="off"
		>
			{pageHeader}
			{tableShell}
			<Notifications />
		</div>
	);
};
