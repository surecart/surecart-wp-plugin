/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';
import { ScIcon, ScStackedListRow } from '@surecart/components-react';

export default ({ title, icon, description, region }) => {
	return (
		<ScStackedListRow
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
			<ScIcon name="chevron-right" slot="suffix"></ScIcon>
		</ScStackedListRow>
	);
};
