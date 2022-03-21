/** @jsx jsx */

import { css, jsx } from '@emotion/core';

export default ({ errors }) => {
	return (errors || []).map((error) => {
		return (
			<p
				className="sc-validation-error"
				css={css`
					color: #cc1818;
					margin-top: 0;
					margin-bottom: 7px;
					font-size: 12px;
				`}
			>
				{error?.message}
			</p>
		);
	});
};
