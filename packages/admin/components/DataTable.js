/** @jsx jsx */
import { __, _n } from '@wordpress/i18n';

import Box from '../ui/Box';
import { css, jsx } from '@emotion/core';
import { ScTable, ScTableRow, ScTableCell } from '@surecart/components-react';

export default ({
	title = '',
	footer = '',
	after = '',
	items = [],
	hideHeader = false,
	headerAction = '',
	columns = {},
	children,
	empty = '',
	loading,
	updating,
	className,
}) => {
	if ((items || []).length === 0 && !loading && !updating) {
		return (
			<>
				<Box
					title={title}
					loading={loading}
					footer={footer}
					header_action={headerAction}
				>
					{empty}
				</Box>
				{after}
			</>
		);
	}

	return (
		<div
			className={className}
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
				header_action={headerAction}
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
								style={{
									width: columns[key]?.width,
									minWidth: columns[key]?.minWidth,
								}}
								key={key}
							>
								{columns[key]?.label}
							</ScTableCell>
						))}

					{(items || []).map((item) => (
						<ScTableRow key={item?.key || item?.id}>
							{Object.keys(columns).map((key) => (
								<ScTableCell key={key}>{item[key]}</ScTableCell>
							))}
						</ScTableRow>
					))}
				</ScTable>

				{children}
			</Box>
			{!!after && (
				<div
					css={css`
						margin-top: var(--sc-spacing-medium);
						margin-bottom: var(--sc-spacing-xxx-large);
					`}
				>
					{after}
				</div>
			)}
		</div>
	);
};
