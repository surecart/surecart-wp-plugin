/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { ComplementaryArea } from '@wordpress/interface';

/**
 * Internal dependencies.
 */
import { SIDEBAR_COMPLEMENTARY_AREA_SCOPE } from '../constants';

export default function ({ className, ...props }) {
	return (
		<ComplementaryArea
			panelClassName={className}
			className="surecart-editor__sidebar"
			css={css`
				flex-shrink: 0;
				height: 100%;
				overflow: scroll;
			`}
			scope={SIDEBAR_COMPLEMENTARY_AREA_SCOPE}
			{...props}
		/>
	);
}
