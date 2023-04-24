/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Notice, Placeholder } from '@wordpress/components';

export default ({ label, children }) => {
	return (
		<Placeholder withIllustration={true}>
			<h2>{label}</h2>
			<Notice
				status="warning"
				isDismissible={false}
				css={css`
					margin: 0;
				`}
			>
				{children}
			</Notice>
		</Placeholder>
	);
};
