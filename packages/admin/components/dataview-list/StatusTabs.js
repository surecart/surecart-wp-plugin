/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * WP-style status tab strip rendered above a DataViewList.
 *
 * Each tab maps to a single filter (one field, one value). Active state is
 * derived from the current `view.filters`. Counts are optional; if absent,
 * the count is hidden.
 *
 * Tabs are intentionally generic — they don't know about products or
 * collections. The screen passes its own list and a callback to set the
 * filter on the active view.
 *
 * @param {Object} props
 * @param {Array<{value:*, label:string, count?:number}>} props.tabs
 * @param {*}        props.activeValue
 * @param {Function} props.onChange      called with the new value
 */
export default ({ tabs, activeValue, onChange }) => (
	<nav
		role="tablist"
		aria-label="Filter by status"
		css={css`
			display: flex;
			gap: 4px;
			margin: 0 0 8px;
			border-bottom: 1px solid
				var(--sc-card-border-color, var(--sc-color-gray-300));
		`}
	>
		{tabs.map((tab) => {
			const isActive = tab.value === activeValue;
			return (
				<button
					key={String(tab.value)}
					type="button"
					role="tab"
					aria-selected={isActive}
					onClick={() => onChange(tab.value)}
					css={css`
						appearance: none;
						background: transparent;
						border: 0;
						border-bottom: 2px solid transparent;
						padding: 10px 14px;
						margin-bottom: -1px;
						font-size: 13px;
						font-weight: 500;
						color: var(--sc-color-gray-700, #4b5563);
						cursor: pointer;
						display: inline-flex;
						align-items: center;
						gap: 6px;
						line-height: 1;
						border-radius: 0px;

						&:hover {
							color: var(--sc-color-gray-900, #111827);
						}
						&:focus-visible {
							outline: 2px solid var(--sc-color-primary-500);
							outline-offset: -2px;
							border-radius: 0px;
						}

						${isActive &&
						css`
							color: var(--sc-color-primary-500);
							border-bottom-color: var(--sc-color-primary-500);
							font-weight: 600;
						`}
					`}
				>
					<span>{tab.label}</span>
					{typeof tab.count === 'number' && (
						<span
							css={css`
								display: inline-flex;
								align-items: center;
								justify-content: center;
								min-width: 20px;
								padding: 0 6px;
								height: 18px;
								font-size: 11px;
								font-weight: 500;
								line-height: 1;
								border-radius: 9px;
								color: var(--sc-color-gray-700, #4b5563);
								background: var(--sc-color-gray-100, #f3f4f6);
							`}
						>
							{tab.count}
						</span>
					)}
				</button>
			);
		})}
	</nav>
);
