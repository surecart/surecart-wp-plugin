/** @jsx jsx */
import { __, _n } from '@wordpress/i18n';

import Box from '../ui/Box';
import { css, jsx } from '@emotion/core';

export default ({
	title = '',
	footer = '',
	items = [],
	hideHeader = false,
	columns = {},
	children,
	empty = '',
	loading,
}) => {
	const renderLoading = () => {
		return (
			<sc-table
				style={{
					'--shadow': 'none',
					'--border-radius': '0',
					borderLeft: '0',
					borderRight: '0',
				}}
			>
				{!hideHeader &&
					Object.keys(columns).map((key) => (
						<sc-table-cell
							slot="head"
							style={{ width: columns[key]?.width }}
							key={key}
						>
							{columns[key]?.label}
						</sc-table-cell>
					))}

				<sc-table-row>
					{Object.keys(columns).map((key) => (
						<sc-table-cell key={key}>
							<sc-skeleton></sc-skeleton>
						</sc-table-cell>
					))}
				</sc-table-row>
			</sc-table>
		);
	};

	if ((items || []).length === 0 && !loading) {
		return <Box title={title}>{empty}</Box>;
	}

	return (
		<div
			css={css`
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
			`}
		>
			<Box
				title={title}
				noPadding={true}
				footer={
					!!(loading && footer) ? (
						<sc-skeleton style={{ width: '70px' }}></sc-skeleton>
					) : (
						footer
					)
				}
			>
				{loading ? (
					renderLoading()
				) : (
					<sc-table
						style={{
							'--shadow': 'none',
							'--border-radius': '0',
							borderLeft: '0',
							borderRight: '0',
						}}
					>
						{!hideHeader &&
							Object.keys(columns).map((key) => (
								<sc-table-cell
									slot="head"
									style={{ width: columns[key]?.width }}
									key={key}
								>
									{columns[key]?.label}
								</sc-table-cell>
							))}

						{(items || []).map((item) => (
							<sc-table-row key={item.id}>
								{Object.keys(columns).map((key) => (
									<sc-table-cell key={key}>
										{item[key]}
									</sc-table-cell>
								))}
							</sc-table-row>
						))}
					</sc-table>
				)}
				{children}
			</Box>
		</div>
	);
};
