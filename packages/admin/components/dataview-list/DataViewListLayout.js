/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';
import { DataViews } from '@wordpress/dataviews/wp';
import { Spinner } from '@wordpress/components';
import Notifications from '../Notifications';

/**
 * DataViewListLayout — Reusable wrapper for SureCart admin list pages.
 *
 * Renders: optional status tabs + optional header controls, then a card-wrapped DataViews table.
 *
 * @example
 * <DataViewListLayout
 *   tabs={STATUS_TABS}
 *   activeTab={status}
 *   onTabChange={setStatus}
 *   headerControls={<ModelSelector ... />}
 *   data={records}
 *   fields={fields}
 *   view={view}
 *   onChangeView={setView}
 *   paginationInfo={paginationInfo}
 *   actions={actions}
 *   isLoading={!hasResolved}
 * />
 *
 * @param {Object}   props
 * @param {Array}    [props.tabs]            - Tab objects: [{ value, label }]. Omit for no tabs.
 * @param {string}   [props.activeTab]       - Currently active tab value.
 * @param {Function} [props.onTabChange]     - Called with new tab value.
 * @param {React.ReactNode} [props.headerControls] - Controls rendered opposite the tabs (e.g. filter dropdowns).
 * @param {React.ReactNode} [props.header]   - Content rendered next to the gear icon inside DataViews.
 * @param {string}   [props.className]       - Additional CSS class for the wrapper.
 *
 * All remaining props are forwarded to <DataViews>.
 */
export default function DataViewListLayout({
	tabs,
	activeTab,
	onTabChange,
	headerControls,
	header,
	className = '',
	// DataViews props.
	data,
	fields,
	view,
	onChangeView,
	paginationInfo,
	actions,
	isLoading,
	isMutating = false,
	defaultLayouts,
	...rest
}) {
	const hasTabs = tabs && tabs.length > 0;
	const hasControls = hasTabs || headerControls;

	return (
		<div className={`sc-dataview-list-wrapper ${className}`.trim()}>
			{hasControls && (
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: space-between;
						gap: 16px;
						margin-top: 12px;
						margin-bottom: 16px;
						flex-wrap: wrap;
					`}
				>
					{hasTabs ? (
						<ul
							css={css`
								display: flex;
								gap: 0;
								margin: 0;
								padding: 0;
								list-style: none;
								border-bottom: 1px solid #c3c4c7;
							`}
						>
							{tabs.map((tab) => (
								<li
									key={tab.value}
									css={css`
										margin: 0 0 -1px 0;
									`}
								>
									<a
										href={`#${tab.value}`}
										onClick={(e) => {
											e.preventDefault();
											onTabChange?.(tab.value);
										}}
										css={css`
											display: inline-block;
											padding: 6px 12px;
											text-decoration: none;
											font-size: 14px;
											font-weight: ${activeTab ===
											tab.value
												? '600'
												: '400'};
											color: ${activeTab === tab.value
												? '#1d2327'
												: '#646970'};
											border-bottom: ${activeTab ===
											tab.value
												? '2px solid #1d2327'
												: '2px solid transparent'};
											transition: color 0.15s ease;
											&:hover {
												color: #1d2327;
											}
											&:focus {
												outline: none;
												color: #1d2327;
											}
										`}
									>
										{tab.label}
									</a>
								</li>
							))}
						</ul>
					) : (
						<div />
					)}

					{headerControls && (
						<div
							css={css`
								min-width: 240px;
							`}
						>
							{headerControls}
						</div>
					)}
				</div>
			)}

			<div
				css={css`
					position: relative;
					background: var(
						--sc-card-background-color,
						var(--sc-color-white)
					);
					border: 1px solid
						var(--sc-card-border-color, var(--sc-color-gray-300));
					border-radius: var(--sc-input-border-radius-medium);
					box-shadow: var(--sc-shadow-small);
					${!hasControls ? 'margin-top: 12px;' : ''}
				`}
			>
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
					header={header}
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
							background: rgba(255, 255, 255, 0.6);
							border-radius: inherit;
							z-index: 10;
						`}
					>
						<Spinner style={{ width: '28px', height: '28px' }} />
					</div>
				)}
			</div>

			<Notifications />
		</div>
	);
}
