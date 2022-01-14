/** @jsx jsx */
import { __, _n } from '@wordpress/i18n';

import Box from '../ui/Box';
import { css, jsx } from '@emotion/core';

export default ({
	title = '',
	footer = '',
	items = [],
	columns = {},
	renderCell = () => {},
	loading,
}) => {
	const renderLoading = () => {
		return (
			<ce-table>
				<ce-table-cell slot="head">
					<ce-skeleton style={{ width: '50px' }}></ce-skeleton>
				</ce-table-cell>
				<ce-table-cell slot="head">
					<ce-skeleton style={{ width: '100px' }}></ce-skeleton>
				</ce-table-cell>
				<ce-table-cell slot="head">
					<ce-skeleton style={{ width: '70px' }}></ce-skeleton>
				</ce-table-cell>
				<ce-table-cell slot="head">
					<ce-skeleton style={{ width: '50px' }}></ce-skeleton>
				</ce-table-cell>

				<ce-table-row>
					<ce-table-cell>
						<ce-skeleton></ce-skeleton>
					</ce-table-cell>
					<ce-table-cell>
						<ce-skeleton></ce-skeleton>
					</ce-table-cell>
					<ce-table-cell>
						<ce-skeleton></ce-skeleton>
					</ce-table-cell>
					<ce-table-cell>
						<ce-skeleton></ce-skeleton>
					</ce-table-cell>
				</ce-table-row>
			</ce-table>
		);
	};

	return (
		<div
			css={css`
				ce-table-cell:first-of-type {
					padding-left: 30px;
				}
				ce-table-cell:last-of-type {
					padding-right: 30px;
				}
				.components-card__body {
					padding: 0 !important;
				}
				--ce-table-cell-spacing: var(--ce-spacing-large);
			`}
		>
			<Box
				title={title}
				hasDivider={false}
				footer={
					!!(loading && footer) ? (
						<ce-skeleton style={{ width: '70px' }}></ce-skeleton>
					) : (
						footer
					)
				}
			>
				{loading ? (
					renderLoading()
				) : (
					<ce-table
						style={{
							'--shadow': 'none',
							'--border-radius': '0',
						}}
					>
						{Object.keys(columns).map((key) => (
							<ce-table-cell
								slot="head"
								style={{ width: columns[key]?.width }}
								key={key}
							>
								{columns[key]?.label}
							</ce-table-cell>
						))}

						{(items || []).map((item) => (
							<ce-table-row key={item.id}>
								{Object.keys(columns).map((key) => (
									<ce-table-cell key={key}>
										{item[key]}
									</ce-table-cell>
								))}
							</ce-table-row>
						))}
					</ce-table>
				)}
			</Box>
		</div>
	);
};
