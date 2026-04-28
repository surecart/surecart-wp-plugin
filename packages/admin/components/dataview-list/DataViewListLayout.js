/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { DataViews } from '@wordpress/dataviews/wp';
import { Spinner } from '@wordpress/components';
import Notifications from '../Notifications';

/**
 * Wrapper around `<DataViews>` that adds:
 *   - an above-table slot (`tabs`) for status tabs / filter pills
 *   - a mutation overlay spinner for bulk operations
 *   - SureCart-themed wrapper styling
 *
 * `defaultLayouts` is forwarded as-is — screens can opt into grid by passing
 * `{ table: {}, grid: { mediaField: 'image', titleField: 'name' } }`.
 */
export default ({
	header,
	tabs,
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
	...rest
}) => (
	<div className={`sc-dataview-list-wrapper ${className}`.trim()}>
		{tabs ? <div>{tabs}</div> : null}
		<div
			css={css`
				position: relative;
				margin-top: 12px;
				background: var(
					--sc-card-background-color,
					var(--sc-color-white)
				);
				border: 1px solid
					var(--sc-card-border-color, var(--sc-color-gray-300));
				border-radius: var(--sc-input-border-radius-medium);
				box-shadow: var(--sc-shadow-small);
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
