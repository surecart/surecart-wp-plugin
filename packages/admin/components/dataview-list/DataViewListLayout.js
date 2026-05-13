/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { DataViews } from '@wordpress/dataviews/wp';
import { Spinner } from '@wordpress/components';
import { InterfaceSkeleton, FullscreenMode } from '@wordpress/interface';
import Notifications from '../Notifications';
import EnhancedViewToggle from './EnhancedViewToggle';
import useEnhancedView from './useEnhancedView';

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
			{enhancedViewControl ? (
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
			{tabs && !enabled ? <div>{tabs}</div> : null}
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

			{isMutating && (
				<div
					css={css`
						position: absolute;
						inset: 0;
						display: flex;
						align-items: center;
						justify-content: center;
						background: rgba(255, 255, 255, 0.4);
						z-index: 10;
					`}
				>
					<Spinner style={{ width: '28px', height: '28px' }} />
				</div>
			)}
		</div>
	);

	if (statusSidebar && enabled) {
		return (
			<div
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
									padding: 24px 32px;
									flex: 1 1 auto;
									min-height: 0;
									overflow-y: auto;
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
			className={`sc-dataview-list-wrapper ${className}`.trim()}
			data-enhanced-view="off"
		>
			{pageHeader}
			{tableShell}
			<Notifications />
		</div>
	);
};
