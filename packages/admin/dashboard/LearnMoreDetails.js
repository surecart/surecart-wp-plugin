/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScFlex, ScIcon, ScStackedListRow } from '@surecart/components-react';

export default ({ icon, href = '#', title, descriptions }) => {
	return (
		<ScStackedListRow
			href={href}
			style={{
				'--columns': '1',
				overflow: 'hidden',
			}}
		>
			<ScFlex
				justify-content="flex-start"
				alignItems="center"
				style={{ '--sc-flex-column-gap': '1em' }}
			>
				<ScIcon
					name={icon}
					style={{
						fontSize: '60px',
						color: 'var(--sc-color-brand-primary)',
					}}
				/>
				<div
					css={css`
						.sc-learn-details-title {
							font-weight: 700;
							font-size: 16px;
							line-height: 28px;
							color: #334155;
							margin: 0.4em 0;
						}
						.sc-learn-details-desc {
							font-weight: 400;
							font-size: 16px;
							line-height: 28px;
							color: #334155;
							margin: 0.4em 0;
						}
						.sc-learn-more-title {
							line-height: 32px;
						}
					`}
				>
					<p className="sc-learn-details-title">{title}</p>
					<p className="sc-learn-details-desc">{descriptions}</p>
				</div>
			</ScFlex>
		</ScStackedListRow>
	);
};
