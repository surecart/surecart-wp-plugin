/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';

export default ({ title, icon, description, region }) => {
	return (
		<sc-stacked-list-row
			href={addQueryArgs(window.location.href, {
				type: 'region',
				region,
			})}
			style={{ '--columns': '3', marginBottom: 0 }}
		>
			<strong
				css={css`
					display: flex;
					align-items: center;
					gap: 0.5em;
					line-height: 0;
				`}
			>
				<span
					css={css`
						font-size: 20px;
					`}
				>
					{icon}
				</span>
				{title}
			</strong>
			<div style={{ opacity: '0.75' }}>{description}</div>
			<sc-icon name="chevron-right" slot="suffix"></sc-icon>
		</sc-stacked-list-row>
	);
};
