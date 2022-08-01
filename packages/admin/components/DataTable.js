/** @jsx jsx */
import { __, _n } from '@wordpress/i18n';

import Box from '../ui/Box';
import { css, jsx } from '@emotion/core';
import { ScTable, ScTableRow, ScTableCell } from '@surecart/components-react';

export default ({
	title = '',
	footer = '',
	items = [],
	hideHeader = false,
	columns = {},
	children,
	empty = '',
	loading,
	updating,
}) => {
	if ((items || []).length === 0 && !loading && !updating) {
		return (
			<Box title={title} loading={loading} footer={footer}>
				{empty}
			</Box>
		);
	}

	return (
		<div
			css={
				!loading &&
				!updating &&
				css`
					sc-table-cell:first-of-type {
						padding-left: 30px;
					}
					sc-table-cell:last-of-type {
						padding-right: 30px;
					}
					.components-card__body {
						padding: 0 !important;
					}
					--sc-table-cell-spacing: var(--sc-spacing-large);
				`
			}
		>
			<Box
				title={title}
				noPadding={true}
				loading={loading || updating}
				footer={footer}
			>
				<ScTable
					style={{
						'--shadow': 'none',
						'--border-radius': '0',
						borderLeft: '0',
						borderRight: '0',
					}}
				>
					{!hideHeader &&
						Object.keys(columns).map((key) => (
							<ScTableCell
								slot="head"
								style={{ width: columns[key]?.width }}
								key={key}
							>
								{columns[key]?.label}
							</ScTableCell>
						))}

					{(items || []).map((item) => (
						<ScTableRow key={item.id}>
							{Object.keys(columns).map((key) => (
								<ScTableCell key={key}>{item[key]}</ScTableCell>
							))}
						</ScTableRow>
					))}
				</ScTable>

				{children}
			</Box>
		</div>
	);
};
