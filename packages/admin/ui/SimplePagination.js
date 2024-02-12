/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScButton, ScButtonGroup, ScIcon } from '@surecart/components-react';

export default ({ page, setPage, hasNext }) => {
	return (
		<div
			css={css`
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
			`}
		>
			<ScButtonGroup>
				<ScButton
					disabled={page === 1}
					onClick={(e) => {
						e.preventDefault();
						setPage(page - 1);
					}}
				>
					<ScIcon name="chevron-left" />
				</ScButton>
				<ScButton
					disabled={!hasNext}
					onClick={(e) => {
						e.preventDefault();
						setPage(page + 1);
					}}
				>
					<ScIcon name="chevron-right" />
				</ScButton>
			</ScButtonGroup>
		</div>
	);
};
