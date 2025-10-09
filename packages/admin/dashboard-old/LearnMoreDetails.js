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
				css={css`
					padding: var(--sc-spacing-small);
				`}
				style={{ '--sc-flex-column-gap': '1em' }}
			>
				<ScIcon
					name={icon}
					style={{
						fontSize: '48px',
						'--sc-icon-stroke-width': '1px',
						color: 'var(--sc-color-primary-500)',
					}}
				/>
				<div>
					<p
						css={css`
							font-weight: 700;
							font-size: 16px;
							line-height: 28px;
							color: #334155;
							margin: 0;
						`}
					>
						{title}
					</p>
					<p
						css={css`
							font-weight: 400;
							font-size: 16px;
							line-height: 28px;
							color: #334155;
							margin: 0;
						`}
					>
						{descriptions}
					</p>
				</div>
			</ScFlex>
			<ScIcon
				slot="suffix"
				name="chevron-right"
				style={{ fontSize: '20px', color: 'var(--sc-color-gray-400)' }}
			/>
		</ScStackedListRow>
	);
};
