/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScIcon, ScStackedListRow } from '@surecart/components-react';
import { useLink, useLocation } from '../../router';

export default ({ title, icon, description, region }) => {
	const location = useLocation();
	const { href, onClick } = useLink({
		...location.params,
		type: 'region',
		region,
	});

	return (
		<ScStackedListRow
			href={href}
			onClick={onClick}
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
